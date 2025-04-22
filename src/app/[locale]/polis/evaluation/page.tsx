'use client';

import React, { useCallback, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { useFormik } from 'formik';
import { toast } from 'react-toastify';
import * as Yup from 'yup';

import Button from '@/components/atoms/Button';
import Checkbox from '@/components/atoms/Checkbox';
import Heading from '@/components/atoms/Typography/Heading';
import Paragraph from '@/components/atoms/Typography/Paragraph';
import InputText from '@/components/molecules/InputText';
import Modal from '@/components/molecules/Modal';
import Upload from '@/components/molecules/Upload';
import { evaluatePolis, uploadFile } from '@/services/polis';

const EvaluationForm = () => {
  const router = useRouter();
  const t = useTranslations('ReimburseSubmission');
  const schemaValidation = Yup.object().shape({
    reimbursementName: Yup.string().required('Reimbursement name is required'),
  });
  const [errorSubmit, setErrorSubmit] = useState();
  const [toggleUpload, setToggleUpload] = useState({
    front: false,
    back: false,
    right: false,
    left: false,
  });

  const [uploadedPath, setUploadedPath] = useState<any>({});
  const [isSubmiting, setSubmitting] = useState<boolean>(false);
  const [modalPolisCreated, setModalPolisCreated] = useState(false);

  const [checklistDamage, setCheckListDamage] = useState<any>({
    front: {
      title: 'Depan',
      fields: {
        engine_hood: {
          checked: false,
          pic_url: '',
          label: 'Engine Hood',
        },
        bumper_depan: {
          checked: false,
          pic_url: '',
          label: 'Bumper Depan',
        },
        grill: {
          checked: false,
          pic_url: '',
          label: 'Grill',
        },
        lampu_depan: {
          checked: false,
          pic_url: '',
          label: 'Lampu Depan',
        },
        kaca_depan: {
          checked: false,
          pic_url: '',
          label: 'Kaca Depan',
        },
      },
    },
    left: {
      title: 'Kiri',
      fields: {
        fender_depan_kiri: {
          checked: false,
          pic_url: '',
          label: 'Fender Depan Kiri',
        },
        fender_belakang_kiri: {
          checked: false,
          pic_url: '',
          label: 'Fender Belakang Kiri',
        },
        pintu_depan_kiri: {
          checked: false,
          pic_url: '',
          label: 'Pintu Depan Kiri',
        },
        pintu_belakang_kiri: {
          checked: false,
          pic_url: '',
          label: 'Pintu Belakang Kiri',
        },
        pillar_kiri: {
          checked: false,
          pic_url: '',
          label: 'Pillar Kiri',
        },
        kaca_kiri: {
          checked: false,
          pic_url: '',
          label: 'Kaca Kiri',
        },
      },
    },
    right: {
      title: 'Kanan',
      fields: {
        fender_depan_kanan: {
          checked: false,
          pic_url: '',
          label: 'Fender Depan Kanan',
        },
        fender_depan_belakang: {
          checked: false,
          pic_url: '',
          label: 'Fender Depan Belakang',
        },
        pintu_depan_kanan: {
          checked: false,
          pic_url: '',
          label: 'Pintu Depan Kanan',
        },
        pintu_belakang_kanan: {
          checked: false,
          pic_url: '',
          label: 'Pintu Belakang Kanan',
        },
        pillar_kanan: {
          checked: false,
          pic_url: '',
          label: 'Pillar Kanan',
        },
        kaca_kanan: {
          checked: false,
          pic_url: '',
          label: 'Kaca Kanan',
        },
      },
    },
    back: {
      title: 'Belakang',
      fields: {
        deck_lid: {
          checked: false,
          pic_url: '',
          label: 'Deck Lid',
        },
        bumper_belakang: {
          checked: false,
          pic_url: '',
          label: 'Bumper Belakang',
        },
        pintu_bagasi: {
          checked: false,
          pic_url: '',
          label: 'Pintu Bagasi',
        },
        lampu_belakang: {
          checked: false,
          pic_url: '',
          label: 'Lampu Belakang',
        },
        kaca_belakang: {
          checked: false,
          pic_url: '',
          label: 'Kaca Belakang',
        },
      },
    },
  });

  const formik = useFormik({
    initialValues: {
      id_polis: '',
      damage_reason: '',
    },
    onSubmit: async (values) => {
      try {
        setSubmitting(true);
        const payload = {
          ...values,
          damages: Object.keys(uploadedPath).map((key: string) => {
            return {
              part: key,
              image_path: uploadedPath?.[key],
            };
          }),
        };

        const response = await evaluatePolis(payload);
        if (response.status == 201) {
          setModalPolisCreated(true);
        }
      } catch (err: any) {
        console.error('ERROR', err);
        toast.error(err?.response?.data?.error || 'Terjadi Kesalahan, mohon coba lagi');
        setErrorSubmit(err?.response?.data?.reason || 'Terjadi Kesalahan, mohon coba lagi');
      }
      setSubmitting(false);
    },
  });

  const handleUploadFile = useCallback(
    async (e: any, fieldName: string) => {
      try {
        const response: any = await uploadFile({ file: e.value });
        if (response) {
          setUploadedPath((prev: any) => {
            return { ...prev, [fieldName]: response.data.filepath };
          });
        }
      } catch (err) {
        console.error(err);
      }
    },
    [checklistDamage]
  );

  return (
    <div className='h-min-screen relative min-h-screen w-full px-[64px] py-[64px] md:px-[120px]'>
      <div>
        <Heading level={3}>Input Evaluasi Kendaraan</Heading>
        <Paragraph level={2}>Silahkan input data evaluasi kendaraan</Paragraph>
      </div>
      <div className='flex flex-1 flex-col'>
        <form onSubmit={formik.handleSubmit} className='flex flex-col gap-8'>
          <div>
            <div className='mt-6 grid grid-cols-2 gap-4'>
              <InputText
                name='id_polis'
                onChange={formik.handleChange}
                label={'Nomor Polis'}
                placeholder={'Masukkan Nomor Polis'}
              />
            </div>
          </div>
          <div>
            <Heading level={4}>Detail Kerusakan Mobil</Heading>
            <Paragraph level={2}>Silahkan pilih titik-titik kerusakan Mobil</Paragraph>
            <div className='mt-4 flex flex-col gap-4'>
              <InputText name='damage_reason' onChange={formik.handleChange} placeholder={'Kronologi kerusakan'} />
              <div>
                <div className='flex flex-col gap-8 md:flex-row'>
                  {Object.keys(checklistDamage).map((key: any) => {
                    return (
                      <div key={`section-${key}`} className='flex flex-col gap-2'>
                        <Paragraph level={2} className='font-bold'>
                          {checklistDamage?.[key]?.title}
                        </Paragraph>
                        <div className='flex flex-col gap-1'>
                          {Object.keys(checklistDamage?.[key]?.fields).map((key2: any) => {
                            return (
                              <Checkbox
                                key={`cb-${key2}`}
                                value={checklistDamage?.[key]?.fields?.[key2]?.checked}
                                name={key2}
                                label={checklistDamage?.[key]?.fields?.[key2]?.label}
                                onChange={(e) => {
                                  setCheckListDamage((prev: any) => {
                                    return {
                                      ...prev,
                                      [key]: {
                                        ...prev[key],
                                        fields: {
                                          ...prev[key].fields,
                                          [key2]: {
                                            ...prev[key].fields[key2],
                                            checked: e.target.checked,
                                          },
                                        },
                                      },
                                    };
                                  });
                                }}
                              />
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>
                <div className='mt-8 grid grid-cols-1 gap-8 md:grid-cols-2'>
                  {Object.keys(checklistDamage).map((key: any) => {
                    return Object.keys(checklistDamage?.[key]?.fields).map((key2: any, index) => {
                      return (
                        checklistDamage?.[key]?.fields?.[key2]?.checked && (
                          <div key={key2} className='flex flex-col gap-4 rounded-md border border-gray-300 p-6'>
                            <div className='flex flex-row justify-between'>
                              <Heading level={5}>{checklistDamage?.[key]?.fields?.[key2]?.label}</Heading>
                            </div>
                            <Upload
                              keyField={`upload-file-${key2}`}
                              name={key2}
                              onChangeValue={(e) => handleUploadFile(e, key2)}
                            />
                            {uploadedPath?.[key2] && (
                              <Image
                                className='h-[300px] w-full rounded-xl bg-gray-100 object-contain'
                                height={300}
                                width={200}
                                objectFit='contain'
                                src={process.env.NEXT_PUBLIC_BASE_URL + uploadedPath?.[key2]}
                                alt='Foto Detail Kerusakan Depan'
                              />
                            )}
                          </div>
                        )
                      );
                    });
                  })}
                </div>
              </div>
              <div className='grid grid-cols-2 gap-4'></div>
            </div>
          </div>

          {errorSubmit ? (
            <Paragraph level={2} className='rounded-md bg-red-100 p-4 text-red-700'>
              {errorSubmit}
            </Paragraph>
          ) : null}
          <Button isLoading={isSubmiting} type='submit'>
            Submit
          </Button>
        </form>
      </div>
      <Modal
        containerClassName='max-w-[300px]'
        title='Data Hasil Pengecekan Mobil Berhasil Disimpan!'
        onClose={() => {
          setModalPolisCreated(false);
          router.push('/');
        }}
        visible={modalPolisCreated}
      >
        <div>
          <Paragraph className='text-center'>
            Data pengecekan mobil untuk registrasi polis telah berhasil diinput. Data ini akan digunakan sebagai acuan
            untuk proses klaim polis.
          </Paragraph>
          <div className='flex w-full flex-row items-end justify-center'>
            <Button
              onClick={() => {
                setModalPolisCreated(false);
                router.push('/');
              }}
              className='mt-4'
            >
              Oke
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default EvaluationForm;
