import Button from './index';

export default {
  component: Button,
  argTypes: {
    className: { control: 'text' },
    onClick: { action: 'clicked' },
  },
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
};

export const VariantPrimary = {
  name: 'Variant: Primary',
  args: {
    children: 'Primary',
    variant: 'primary',
    size: 'large',
  },
};

export const VariantSecondary = {
  name: 'Variant: Secondary',
  args: {
    children: 'Secondary',
    variant: 'secondary',
  },
};

export const VariantTertiary = {
  name: 'Variant: Tertiary',
  args: {
    children: 'Tertiary',
    variant: 'tertiary',
  },
};

export const SizeLarge = {
  name: 'Size: Large',
  args: {
    children: 'Large',
    variant: 'primary',
    size: 'large',
  },
};

export const SizeMedium = {
  name: 'Size: Medium',
  args: {
    children: 'Medium',
    variant: 'primary',
    size: 'medium',
  },
};

export const SizeSmall = {
  name: 'Size: Small',
  args: {
    children: 'Small',
    variant: 'primary',
    size: 'small',
  },
};

export const SizeExtraSmall = {
  name: 'Size: ExtraSmall',
  args: {
    children: 'Extra Small',
    variant: 'primary',
    size: 'extraSmall',
  },
};

export const StateLoading = {
  name: 'State: Loading',
  args: {
    children: 'Loading',
    variant: 'primary',
    isLoading: true,
  },
};

export const StateDisabled = {
  name: 'State: Disabled',
  args: {
    children: 'Disabled',
    variant: 'primary',
    isDisabled: true,
  },
};
