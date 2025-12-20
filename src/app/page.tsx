import Link from "next/link";
import localFont from 'next/font/local';

import styles from '@/styles/homepage.module.scss';
import {ToggleThemes} from "@/lib/ThemeProviders"

const Liu_Jian_Mao_Cao = localFont({
  src: [{
      path: '../fonts/liu_jian_mao_cao.woff2',
      weight: '400',
      style: 'normal',
    }],
    display: 'swap',
    preload: true,
});

export default function Page() {
  return (
    <div className="h-screen flex justify-center items-center">
      <div className={styles.homepage}>
        <div className={styles.theme}>
          <ToggleThemes />
        </div>
        <div className={`${Liu_Jian_Mao_Cao.className} ${styles.contents}`}>
          <div className={styles.title}>
            <h1>陋室铭</h1>
            <Link href="/blog" className={styles.bloglink}>Blog</Link>
          </div>
          <div className={styles.article}>
            <div>
              山不在高，有仙则名。水不在深，有龙则灵。斯是陋室，惟吾德馨。苔痕上阶绿，草色入帘青。谈笑有鸿儒，往来无白丁。可以调素琴，阅金经。无丝竹之乱耳，无案牍之劳形。南阳诸葛庐，西蜀子云亭。孔子云：何陋之有？ 
            </div>
            <p>唐 - 刘禹锡</p>
          </div>
        </div>
      </div>
    </div>
  );
}
