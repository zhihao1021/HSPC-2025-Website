import { ReactNode } from "react";
import { Link } from "react-router-dom";

import validImage from "@/assets/tutorial/valid.png";

import style from "./index.module.scss";
import CacheImage from "@/utils/CacheImage";

export default function TutorialPage(): ReactNode {
    return <div className={style.tutorialPage}>
        <h1>如何報名</h1>
        <h2>1. 登入並加入官方 Discord</h2>
        <div>
            <span>請先點擊網頁右上方的</span>
            <Link
                className={style.login}
                to="/login"
            >登入</Link>
            <span>透過 Discord 帳號進行登入並加入</span>
            <a
                href="https://discord.gg/zWbHJ47Uut"
                target="_blank"
                className={style.link}
            >官方 Discord</a>
            <span>。</span>
        </div>
        <h2>2. 進行帳號驗證</h2>
        <div>
            <span>在登入並加入官方 Discord 後，請前往</span>
            <a
                href="https://discord.com/channels/1080542740548431952/1349708361087844434/1349708856963366934"
                target="_blank"
                className={style.link}
            >驗證頻道</a>
            <span>進行帳號驗證。</span>
            <CacheImage src={validImage} />
        </div>
        <h2>3. 填寫個人資料</h2>
        <div>
            <span>登入後，請點擊網頁右上方的頭像前往</span>
            <Link to="/profile" className={style.link}>資料維護</Link>
            <span>頁面填寫資料並上傳學生證。</span>
        </div>
        <div>
            <span>填寫完成後，等待主辦單位進行檢查，當檢查通過後驗證狀態將由</span>
            <span data-status={false}>等待驗證中</span>
            <span>轉為</span>
            <span data-status={true}>已驗證</span>
            <span>。</span>
        </div>
        <h2>4. 創建或加入隊伍</h2>
        <div>
            <span>在等待驗證期間，可以先至</span>
            <Link to="/profile/team" className={style.link}>隊伍管理</Link>
            <span>頁面選擇要創建隊伍或是加入隊伍：</span>
            <h3>4-1 創建隊伍</h3>
            <div>
                <span>在創建隊伍的欄位中填入隊伍名稱後，點擊右方的</span>
                <span className={style.fakeButton}>
                    <span className="ms">add</span>
                    <span>創建</span>
                </span>
                <span>按鈕進行創建。</span>
            </div>
            <h3>4-2 加入隊伍</h3>
            <div>
                <span>在加入隊伍的欄位中填入欲加入的隊伍 ID 後，點擊右方的</span>
                <span className={style.fakeButton}>
                    <span className="ms">group_add</span>
                    <span>加入</span>
                </span>
                <span>按鈕即可加入隊伍。</span>
            </div>
        </div>
        <h2>5. 管理隊伍</h2>
        <div>
            <span>在管理頁面中可以變更隊伍名稱以及查看當前隊伍的 ID 及隊伍成員資訊。</span>
        </div>
        <div>
            <span>當隊伍中至少有兩位、至多三位隊員，並且所有隊員皆通過 Discord 驗證以及資格驗證後，隊伍的資格狀態會自動由</span>
            <span data-status={false}>不符資格</span>
            <span>轉為</span>
            <span data-status={true}>符合資格</span>
            <span>。</span>
        </div>
    </div>;
}