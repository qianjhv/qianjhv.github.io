import Link from "next/link";
import { Liu_Jian_Mao_Cao } from 'next/font/google';

import { ThemeChanger } from "@/lib/ThemeProviders";

import '@/styles/homepage.scss';
 
const maocao = Liu_Jian_Mao_Cao({
  weight: '400',
  subsets: ['latin'],
});

export default function Page() {
  return (
    <div className="homepage">
      <div className="theme">
        <ThemeChanger />
      </div>
      <div className={`${maocao.className} contents`}>
        <div className="title">
          <h1>陋室铭</h1>
          <Link href="/blog" className="bloglink">Blog</Link>
        </div>
        <div className="article">
          <div>
            山不在高，有仙则名。水不在深，有龙则灵。斯是陋室，惟吾德馨。苔痕上阶绿，草色入帘青。谈笑有鸿儒，往来无白丁。可以调素琴，阅金经。无丝竹之乱耳，无案牍之劳形。南阳诸葛庐，西蜀子云亭。孔子云：何陋之有？ 
          </div>
          <p>唐 - 刘禹锡</p>
        </div>
      </div>
    </div>
  );
}