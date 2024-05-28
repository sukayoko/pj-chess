// _app.tsxは、全てのページに共通するレイアウトを定義するために使用されます。
// 例えば、ヘッダーやフッターを定義したり、CSSファイルやJavaScriptライブラリをインポートすることができます。
// また、_app.tsxでは、ページ遷移時に実行される共通の処理を定義することもできます。

// 例えば、Google Analyticsのトラッキングコードの初期化などが挙げられます。

// _app.tsxは、Next.jsのライフサイクルメソッドを使用して、アプリケーションの初期化やページ遷移時の処理を実行することができます。
// 例えば、getInitialPropsメソッドを使用して、サーバーサイドレンダリング時にデータを取得することができます。

// _app.tsxは、Next.jsアプリケーションのカスタマイズに必要なファイルの1つであり、
// アプリケーション全体の見た目や動作を定義するために使用されます。
import { AppProps } from 'next/app';
import Head from 'next/head';
import { MantineProvider } from '@mantine/core';
import { Notifications } from '@mantine/notifications';
import Layout from '@/components/layout';

import { SessionProvider } from "next-auth/react"
import type { Session } from "next-auth"

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps<{ session: Session }>) {
  // ここの定義は _document.tsxで定義しないとレンダリングされないらしい
  return (
    <SessionProvider session={session}>
      <Head>
        <title>skyk test site</title>
        <meta name="viewport" content="minimum-scale=1, initial-scale=1, width=device-width" />
      </Head>
      
      <MantineProvider
        withGlobalStyles
        withNormalizeCSS
        theme={{
          /** Put your mantine theme override here */
          colorScheme: 'light',
        }}
      >
        <Notifications />
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </MantineProvider>
    </SessionProvider>
  );
}