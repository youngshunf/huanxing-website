/**
 * 内测期联系方式配置
 * 新增 QQ / 微信 直接在这里追加，区块组件自动适配
 */

export type ContactType = 'qq' | 'wechat'

export interface BetaContact {
  type: ContactType
  /** 显示名称，如 "唤星AI-001" */
  name: string
  /** QQ 号或微信号 */
  account: string
  /** 二维码图片（用 import 引入后传入） */
  qrcode: string
}

import qqQrcode from '../assets/唤星AI-001_qq.jpg'

export const BETA_CONTACTS: BetaContact[] = [
  {
    type: 'qq',
    name: '唤星AI-001',
    account: '2060719493',
    qrcode: qqQrcode,
  },
  // 后续追加，例如：
  // {
  //   type: 'wechat',
  //   name: '唤星AI官方',
  //   account: 'huanxingai',
  //   qrcode: wechatQrcode,
  // },
]
