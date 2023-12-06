'use client';
import { ButtonHTMLAttributes, FC } from 'react';
import { cva, VariantProps } from 'class-variance-authority';
import { cn } from '../../../utils/twMerge';

export const DeleteBtnIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
            d="M6 7.5V19.125C6 20.1598 6.76824 21 7.71437 21H16.2858C17.2319 21 18 20.1598 18 19.125V7.5"
            stroke="#484848"
            strokeWidth="1.5"
            strokeMiterlimit="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
        <path d="M10.5 10.5V16.5" stroke="#484848" strokeWidth="1.5" strokeMiterlimit="2" strokeLinecap="round" />
        <path d="M13.5 10.5V16.5" stroke="#484848" strokeWidth="1.5" strokeMiterlimit="2" strokeLinecap="round" />
        <path d="M4.5 7.5H19.5" stroke="#484848" strokeWidth="1.5" strokeMiterlimit="2" strokeLinecap="round" />
        <path
            d="M15 7.5V4.5H9V7.5"
            stroke="#484848"
            strokeWidth="1.5"
            strokeMiterlimit="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
    </svg>
);

export const ArrowIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
            d="M9.75 6L3 12.75L9.75 19.5"
            stroke="#1ABCB7"
            strokeWidth="2"
            strokeMiterlimit="5"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
        <path
            d="M3.00073 12.7479H18.0007"
            stroke="#1ABCB7"
            strokeWidth="2"
            strokeMiterlimit="5"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
    </svg>
);
export const ArrowWhiteIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
            d="M12.7507 6L19.5007 12.75L12.7507 19.5"
            stroke="white"
            strokeWidth="2"
            strokeMiterlimit="5"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
        <path
            d="M19.5 12.7479H4.5"
            stroke="white"
            strokeWidth="2"
            strokeMiterlimit="5"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
    </svg>
);

export const ButtonVariants = cva(
    `
  flex w-full justify-center p-3 text-lg font-semibold leading-6 text-TG000 shadow-sm rounded-xl hover:bg-mint500 hover:drop-shadow-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-mint300 disabled:bg-TG400
  `,
    {
        variants: {
            variant: {
                default: 'bg-[#1ABCB7]',
                white: 'bg-TG000 text-[#1ABCB7] border-[#1ABCB7] border shadow hover:bg-TG000 hover:drop-shadow-md',
            },

            size: {
                default: '',
                // md: ' w-[6.875rem] h-[2.375rem] text-[1rem] rounded-md',
                // lg: 'w-[21.875rem] h-[7.5rem] text-[3rem] rounded-3xl',
                // wlg: 'w-[24rem] h-[5.25rem] text-[2rem]',
                oneThird: 'w-1/5		',
                twoThird: 'w-3/4		',
            },
        },
        defaultVariants: {
            variant: 'default',
            size: 'default',
        },
    }
);

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof ButtonVariants> {
    label?: string;
    children?: React.ReactElement | string;
}

const FCButton: FC<ButtonProps> = ({ variant, size, children, label, ...props }) => {
    return (
        <button className={cn(ButtonVariants({ variant, size }))} {...props}>
            {label && label}
            {children}
        </button>
    );
};

export default FCButton;
