'use client';
import PatientTextField from '../../molecules/textField/PatientTextField';
import { Coding } from '../../../controller/DataAnswerModeling';
import { ForwardedRef, forwardRef, useState } from 'react';

const QuestionIcon = () => {
    return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M2.8125 10.4996C2.8125 4.91644 4.15562 2.62463 12 2.62463C19.8443 2.62463 21.1875 4.87781 21.1875 10.4996C21.1875 12.9506 20.9338 14.7614 19.9969 16.0242C20.275 17.1845 20.5921 18.5079 20.8291 19.4972C20.8966 19.7762 20.799 20.0687 20.577 20.2517C20.355 20.4332 20.049 20.4737 19.788 20.3537C18.5141 19.7711 16.6104 18.9001 15.1193 18.2178C14.2153 18.3236 13.1814 18.3746 12 18.3746C4.14687 18.3746 2.8125 16.0828 2.8125 10.4996Z"
                fill="#1ABCB7"
            />
            <path
                d="M11.9011 15.6752C12.481 15.6752 12.9511 15.2051 12.9511 14.6252C12.9511 14.0453 12.481 13.5752 11.9011 13.5752C11.3212 13.5752 10.8511 14.0453 10.8511 14.6252C10.8511 15.2051 11.3212 15.6752 11.9011 15.6752Z"
                fill="white"
            />
            <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M11.1302 11.9115C11.1302 9.93862 13.7434 9.77458 13.7434 8.29379C13.7434 7.47434 12.9629 6.80928 12.0013 6.80928C11.0396 6.80928 10.2592 7.47434 10.2592 8.29379C10.2592 8.70351 9.86895 9.03604 9.38813 9.03604C8.51448 9.03604 8.51709 8.28414 8.51709 8.28414C8.52319 6.64969 10.0824 5.32477 12.0013 5.32477C13.9245 5.32477 15.4854 6.65489 15.4854 8.29379C15.4854 10.4545 12.8723 10.8152 12.8723 12.0051V12.0823C12.8723 12.492 12.4821 12.8245 12.0013 12.8245C11.5204 12.8245 11.1302 12.492 11.1302 12.0823V11.9115Z"
                fill="white"
            />
        </svg>
    );
};

//TODO /추후 공통 으로 개발/
type Props = {
    onSearch?: (keyword?: string, results?: Coding[]) => void;
    onSelect?: (result?: Coding) => void;
    code: Coding[];
    label?: string;
    name: string | null;
    disabled?: boolean;
};
const ControlAutocompleteItem = (code: Coding & { onSelect?: (result?: Coding) => void }) => {
    return (
        <li
            className="group/item flex flex-row justify-between gap-2 py-3 px-4 cursor-pointer hover:bg-mint100"
            onClick={() => {
                code.onSelect && code.onSelect({ code: code.code, display: code.display, system: code.system });
            }}
        >
            <div className="group/edit text-sm group-hover/item:text-mint600">{code.display}</div>
        </li>
    );
};

const ControlAutoComplete = (
    { code, onSearch, label, onSelect, name, disabled }: Props,
    ref: ForwardedRef<HTMLFormElement>
) => {
    const [search, setSearch] = useState<string>('');
    const onSearchTextField = (word: string) => {
        setSearch(word);
        onSearch && onSearch(word);
    };
    return (
        <div className="flex flex-col gap-1">
            {label && (
                <div className="flex flex-row gap-2">
                    <QuestionIcon />
                    <p className="text-base	font-semibold text-[#484848]" style={{ lineHeight: '1.3rem' }}>
                        {label}
                    </p>
                </div>
            )}
            <div className="relative z-30">
                <div className="relative">
                    <PatientTextField
                        id={name ? name + 'search' : 'search'}
                        name={name ? name + 'search' : 'search'}
                        type="text"
                        autoComplete={name ? name + 'search' : 'search'}
                        required
                        value={search}
                        onChange={(e) => onSearchTextField(e.target.value)}
                        style={{ paddingRight: '2.5rem' }}
                        disabled={disabled}
                    />
                </div>
                <button
                    className="absolute top-1/2 right-3 transform -translate-x-1/2 -translate-y-1/2"
                    onClick={() => onSearchTextField(search)}
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="w-4 h-4"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
                        />
                    </svg>
                </button>
                {search && (
                    <div
                        className="absolute top-14 left-0  w-full max-h-40 rounded-lg z-30 border border-solid border-[#E1E1E1] overflow-y-scroll"
                        style={{ backgroundColor: '#fff' }}
                    >
                        <ul className="flex flex-col gap-2" role="list">
                            {code.length ? (
                                code.map((item, index) => {
                                    return (
                                        <ControlAutocompleteItem
                                            {...item}
                                            key={index}
                                            onSelect={(result) => {
                                                onSelect && onSelect(result);
                                                setSearch('');
                                            }}
                                        />
                                    );
                                })
                            ) : (
                                <div className="py-3 px-4">Non data</div>
                            )}
                        </ul>
                    </div>
                )}
            </div>
            {search && <div className="z-10 w-screen h-screen fixed top-0 left-0" onClick={() => setSearch('')} />}
        </div>
    );
};
export default forwardRef<HTMLFormElement, Props>(ControlAutoComplete);

// workspace firstchart-questionnaire
