import { create } from 'zustand'
import type {
  SubscriptionInfo,
  SubscriptionTier,
  CreditPackage,
  PaymentResult,
  CreditHistory,
} from '../types'
import * as subApi from '../api/subscription'

interface SubscriptionState {
  subscription: SubscriptionInfo | null
  tiers: SubscriptionTier[]
  packages: CreditPackage[]
  creditHistory: CreditHistory[]
  historyTotal: number
  loading: boolean

  fetchInfo: () => Promise<void>
  fetchTiers: () => Promise<void>
  fetchPackages: () => Promise<void>
  fetchCreditHistory: () => Promise<void>
  upgrade: (tierName: string, period: string) => Promise<PaymentResult>
  purchaseCredits: (packageId: number) => Promise<PaymentResult>
}

export const useSubscriptionStore = create<SubscriptionState>((set) => ({
  subscription: null,
  tiers: [],
  packages: [],
  creditHistory: [],
  historyTotal: 0,
  loading: false,

  fetchInfo: async () => {
    set({ loading: true })
    try {
      const info = await subApi.getMyInfo()
      set({ subscription: info })
    } finally {
      set({ loading: false })
    }
  },

  fetchTiers: async () => {
    const tiers = await subApi.getTiers()
    set({ tiers })
  },

  fetchPackages: async () => {
    const packages = await subApi.getPackages()
    set({ packages })
  },

  fetchCreditHistory: async () => {
    const list = await subApi.getBalanceHistory()
    set({ creditHistory: list, historyTotal: list.length })
  },

  upgrade: async (tierName, period) => {
    return subApi.upgrade(tierName, period)
  },

  purchaseCredits: async (packageId) => {
    return subApi.purchaseCredits(packageId)
  },
}))
