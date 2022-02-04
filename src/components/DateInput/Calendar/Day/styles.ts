import Button from 'components/Button';
import { styled } from 'styles/Theme.provider';

export const DayButtonContainer = styled(Button, {
  opacity: '0.5',
  backgroundColor: 'transparent',
  color: '$gray11',

  '&:hover': {
    opacity: 1,
    color: '$gray12 !important',
  },

  variants: {
    active: {
      true: {
        opacity: 1,
        backgroundColor: '$primary !important',
        color: 'white',

        '&:hover': {
          color: '$gray1 !important',
          backgroundColor: '$primaryHover !important',
          opacity: 1,
        },
      },
    },
  },
});