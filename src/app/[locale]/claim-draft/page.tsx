'use client';

import React from 'react';
import { useFormik } from 'formik';
import UploadField from '@/components/molecules/UploadField';
import * as Yup from 'yup';
import InputText from '@/components/molecules/InputText';
import Select from '@/components/molecules/Select';
import Upload from '@/components/molecules/Upload';
import { useTranslations } from 'next-intl';
import Button from '@/components/atoms/Button';
import Heading from '@/components/atoms/Typography/Heading';
import Paragraph from '@/components/atoms/Typography/Paragraph';
import Image from 'next/image';
import receiptImage from '@/assets/images/receipt.jpg';
import Modal from '@/components/molecules/Modal';
import Accordion from '@/components/molecules/Accordion';

const SignupForm = () => {
  const t = useTranslations('ReimburseSubmission');
  const schemaValidation = Yup.object().shape({
    reimbursementName: Yup.string().required('Reimbursement name is required'),
  });

  const formik = useFormik({
    initialValues: {
      reimbursementName: '',
      approver: '',
      upload: '',
    },
    onSubmit: (values) => {
      alert(JSON.stringify(values, null, 2));
    },
  });

  return (
    <div className='h-min-screen relative min-h-screen w-full px-[200px] pt-[64px]'>
      <div>
        <Heading level={3}>Lengkapi data untuk claim Asuransi</Heading>
      </div>
      <div className='flex flex-1 flex-col'>
        <form onSubmit={formik.handleSubmit} className='flex flex-col gap-2'>
          {/* <Select
            name='approver'
            onChange={() => {}}
            label={t('approver_field_label')}
            placeholder={t('approver_field_placeholder')}
            options={[
              { label: 'Abyan Pratama', value: 1 },
              { label: 'Faathir Muhammad', value: 2 },
            ]}
          /> */}
          <div>
            <Heading level={4}>Informasi Mobil</Heading>
            <Paragraph level={2}>
              Pihak asuransi memerlukan foto mobil kamu untuk memproses polis. Tolong masukan informasi sesuai dengan
              data yang kamu miliki
            </Paragraph>
            <Upload />
            <div className='grid grid-cols-2 gap-4'>
              <InputText
                name='reimbursementName'
                onChange={formik.handleChange}
                // label={t('claim_field_ktp_number_label')}
                placeholder={'Nomor Polis'}
              />
              <InputText
                name='reimbursementName'
                onChange={formik.handleChange}
                // label={t('claim_field_ktp_number_label')}
                placeholder={'Nomor Plat'}
              />
            </div>
          </div>
          <div>
            <Heading level={4}>Unggah Foto Kerusakan</Heading>
            <Paragraph level={2}>
              Pihak asuransi memerlukan foto mobil kamu untuk memproses polis. Tolong unggah foto mobilmu dalam kondisi
              terang, supaya lebih jelas ya!
            </Paragraph>
            <Upload />
            <InputText
              name='reimbursementName'
              onChange={formik.handleChange}
              // label={t('claim_field_ktp_number_label')}
              placeholder={t('claim_field_ktp_number_label')}
            />
          </div>
          <div>
            <Heading level={4}>Informasi Mobil</Heading>
            <Paragraph level={2}>
              Pihak asuransi memerlukan foto mobil kamu untuk memproses polis. Tolong masukan informasi sesuai dengan
              data yang kamu miliki
            </Paragraph>
            <Upload />
            <div className='grid grid-cols-2 gap-4'>
              <InputText
                name='reimbursementName'
                onChange={formik.handleChange}
                // label={t('claim_field_ktp_number_label')}
                placeholder={'Jenis Mobil'}
              />
              <InputText
                name='reimbursementName'
                onChange={formik.handleChange}
                // label={t('claim_field_ktp_number_label')}
                placeholder={'Jenis Mobil'}
              />
              <InputText
                name='reimbursementName'
                onChange={formik.handleChange}
                // label={t('claim_field_ktp_number_label')}
                placeholder={'Jenis Mobil'}
              />
              <InputText
                name='reimbursementName'
                onChange={formik.handleChange}
                // label={t('claim_field_ktp_number_label')}
                placeholder={'Jenis Mobil'}
              />
              <InputText
                name='reimbursementName'
                onChange={formik.handleChange}
                // label={t('claim_field_ktp_number_label')}
                placeholder={'Jenis Mobil'}
              />
              <InputText
                name='reimbursementName'
                onChange={formik.handleChange}
                // label={t('claim_field_ktp_number_label')}
                placeholder={'Jenis Mobil'}
              />
            </div>
          </div>
          <Button>Submit</Button>
        </form>
      </div>
      <Modal visible={false} title='Detail Reimburse' subtitle='Lembar 1'>
        <Accordion
          accordionItemClassName='!border rounded-sm'
          items={[
            {
              title: 'How do I login?',
              description: (
                <p className='text-[14px] font-medium leading-[18px] text-[#414347]'>
                  Please check this video.{' '}
                  <span
                    className='cursor-pointer font-bold text-[#4C79AB] underline'
                    onClick={() => console.log('clicked!')}
                  >
                    Click Here
                  </span>
                </p>
              ),
            },
          ]}
        />
      </Modal>
    </div>
  );
};

export default SignupForm;
