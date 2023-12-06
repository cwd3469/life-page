'use client';
type Props = {
  children: JSX.Element | JSX.Element[] | string | number | boolean | undefined | null;
};
const BoxCard = (props: Props) => {
  return <div className="flex flex-col bg-TG000 rounded-xl	shadow-lg p-4">{props.children}</div>;
};

export default BoxCard;
