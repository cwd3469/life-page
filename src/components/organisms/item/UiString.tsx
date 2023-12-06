'use client';
import { useModelingQuestion } from '../../../controller/DataContext';
import { ItemComponentProp } from './UiDisplay';

/** item string ui component  */
const ItemUiString = ({ item }: ItemComponentProp) => {
    return <div className="text-lg -tracking-2 w-11/12">{item.text}</div>;
};

export default ItemUiString;
