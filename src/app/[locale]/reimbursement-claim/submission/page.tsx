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
    <div className='h-min-screen relative min-h-screen w-full '>
      <div className='flex flex-1 flex-col'>
        <form onSubmit={formik.handleSubmit} className='mx-auto flex max-w-[40vw] flex-col gap-2'>
          <Heading level={3}>Reimbursement Submission</Heading>
          <InputText
            name='reimbursementName'
            onChange={formik.handleChange}
            label={t('reimbursement_name_field_label')}
            placeholder={t('reimbursement_name_field_placeholder')}
          />
          <Select
            name='approver'
            onChange={() => {}}
            label={t('approver_field_label')}
            placeholder={t('approver_field_placeholder')}
            options={[
              { label: 'Abyan Pratama', value: 1 },
              { label: 'Faathir Muhammad', value: 2 },
            ]}
          />
          <Upload label='Upload Lembar Reimburse' />
          <Button>Submit</Button>
        </form>
        <div className='mt-6'>
          <Heading level={4}>Hasil Analisa</Heading>
          <div>
            <div className='flex flex-row overflow-clip rounded-md border border-neutral4'>
              <Image src={receiptImage} width={100} />
              <div className='flex flex-col justify-between p-4'>
                <div className='flex flex-row justify-between'>
                  <div>
                    <Paragraph level={3}>Total Reimburse</Paragraph>
                    <div className='font-bold'>Rp823.122</div>
                  </div>
                  <div>
                    <Paragraph level={3}>Total Reimburse</Paragraph>
                    <div className='font-bold'>Rp823.122</div>
                  </div>
                </div>
                <Button variant='secondary' size='small'>
                  Lihat Detail
                </Button>
              </div>
            </div>
          </div>
        </div>
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
      <div className=' sticky bottom-0 mx-[-16px] h-[100px] border-t border-neutral5'>
        <Button>Submit</Button>
      </div>
    </div>
  );
};

export default SignupForm;
