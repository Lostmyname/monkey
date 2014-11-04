module.exports = {
  images: '//lostmycdn.imgix.net/widget/{{ gender }}/{{ url }}' +
    '?h={{ height }}&dpr={{ dpr }}&q=60',
  spread: '//lostmynameproduction.s3.amazonaws.com/assets/name_spreads/' +
    '{{ locale }}/{{ gender }}/{{ name }}/spread.jpg?h={{ height }}&dpr={{ dpr }}',
  spreadMissing: '//lmn-assets.imgix.net/widget/en-GB/v2/images/just_rendering.jpg' +
    '?h={{ height }}&dpr={{ dpr }}',
  bookTipSwipe: 'assets/images/book-swipe.png',
  bookTipTap: '//lmn-assets.imgix.net/widget/{{ locale }}/v2/images/book_tip.png' +
    '?h={{ height }}&dpr={{ dpr }}&q=60'
};
