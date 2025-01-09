import { defaultSchema } from 'rehype-sanitize';

const extendedSchema = JSON.parse(JSON.stringify(defaultSchema));

extendedSchema.tagNames = [
  ...(extendedSchema.tagNames ?? []),
  'div',
  'p',
  'section',
  'sup',
  'math',
  'semantics',
  'mrow',
  'mi',
  'mn',
  'mo',
  'msup',
  'annotation',
  'span',
  'svg',
  'path',
  'figure',
  'code'
];

extendedSchema.attributes = {
  ...extendedSchema.attributes,
  '*': [
    ...(extendedSchema.attributes['*'] ?? []),
    'className',
    'style',
    'class',
    'data-line',
    'id',
    'dir',
    'lang',
    'title'
  ],
  div: ['class', 'className', 'style', 'id', 'data*'],
  p: ['class', 'className', 'style', 'id', 'data*'],
  span: [
    'class',
    'style',
    'data*',
    'data-line',
    'data-line-numbers',
    'data-language'
  ],
  math: [
    'xmlns',
    'display',
    'class',
    'style'
  ],
  svg: [
    'xmlns',
    'viewBox',
    'width',
    'height',
    'style',
    'preserveAspectRatio',
    'class'
  ],
  path: [
    'd',
    'fill',
    'stroke',
    'stroke-width',
    'class',
    'style'
  ],
  figure: [
    'class',
    'style',
    'data*',
    'data-rehype-pretty-code-figure'
  ],
  pre: [
    'className',
    'class',
    'data*',
    'data-line-numbers',
    'data-line-numbers-max-digits',
    'dir',
    'style',
    'data-language'
  ],
  code: [
    'className',
    'class',
    'data*',
    'data-line-numbers',
    'data-line-numbers-max-digits',
    'data-language',
    'style'
  ],
  a: [
    'href',
    'title',
    'target',
    'rel'
  ],
  img: [
    'src',
    'alt',
    'title',
    'width',
    'height',
    'loading'
  ],
  td: [
    'align',
    'colspan',
    'rowspan'
  ],
  th: [
    'align',
    'colspan',
    'rowspan',
    'scope'
  ]
};

export default extendedSchema;