import Simple from './Simple';
import { FormExample, makeFormExample } from './utils';

const all: ReadonlyArray<FormExample> = [
  makeFormExample(Simple,{route:'/simple', title:'Simple form'}),
];

export default all;
