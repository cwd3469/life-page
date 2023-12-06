'use client';
import FCButton, { ArrowIcon, ArrowWhiteIcon, ButtonProps } from '../../molecules/button/FCButton';

export type QuestionnaireFooterProps = {
  nextRouter?: () => void;
  prevRouter?: () => void;
  disabled?: boolean;
  nextBtnText?: string;
  btnForm?: 'default' | 'pagiNation';
};

const QuestionnaireFooter = (props: QuestionnaireFooterProps) => {
  const { nextRouter, prevRouter, nextBtnText, disabled, btnForm } = props;
  return (
    <div className="px-4 py-4 flex justify-between sticky bottom-0 left-0 ">
      {btnForm === 'default' ? (
        <FCButton size={'default'} onClick={nextRouter} disabled={disabled}>
          {nextBtnText ? nextBtnText : '시작하기'}
        </FCButton>
      ) : (
        <>
          <FCButton size={'oneThird'} onClick={prevRouter} variant="white">
            <ArrowIcon />
          </FCButton>
          <FCButton size={'twoThird'} onClick={nextRouter} disabled={disabled}>
            <div className="flex w-full justify-between items-center">
              <div className="w-10" />
              {nextBtnText ? nextBtnText : '다음 문진'}
              <ArrowWhiteIcon />
            </div>
          </FCButton>
        </>
      )}
    </div>
  );
};

export default QuestionnaireFooter;
