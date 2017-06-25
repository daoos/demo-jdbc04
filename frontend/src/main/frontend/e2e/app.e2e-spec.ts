import { AgensBrowserBundlePage } from './app.po';

describe('agens-browser-bundle App', () => {
  let page: AgensBrowserBundlePage;

  beforeEach(() => {
    page = new AgensBrowserBundlePage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
