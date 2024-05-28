// 通常、ブラウザはHTMLドキュメントを受信してから解析し、DOMツリーを構築します。
// しかし、Next.jsはサーバーサイドレンダリングをサポートしており、HTMLドキュメントはサーバーで生成されます。
// そのため、_document.tsxファイルを使用することで、サーバーサイドレンダリング時にHTMLドキュメントの構造を定義することができます。

// _document.tsxは、HTMLのヘッダー部分や、CSSやJavaScriptなどのリソースをロードするための設定を定義するために使用されます。
// 例えば、<head>タグの中に、アプリケーションのCSSファイルやJavaScriptライブラリの読み込みを定義することができます。
// また、メタタグやSEOのためのタグの追加なども可能です。

// _document.tsxは、ReactのDocumentクラスを継承しているため、通常のReactコンポーネントと同じようにレンダリングされます。
// _app.tsxと同様に、_document.tsxでも、Next.jsのライフサイクルメソッドを使用して、HTMLドキュメントをカスタマイズすることができます。

// _document.tsxは、Next.jsアプリケーションのカスタマイズに必要なファイルの1つであり、
// アプリケーション全体のHTML構造やリソースの読み込みを定義するために使用されます。

import { createGetInitialProps } from '@mantine/next';
import Document, { Head, Html, Main, NextScript } from 'next/document';
import { Button } from '@mantine/core';

const getInitialProps = createGetInitialProps();


export default class _Document extends Document {
  static getInitialProps = getInitialProps;

  render() {
    return (
      <Html>
        <Head />
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}