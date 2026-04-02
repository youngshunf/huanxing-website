import { request } from './client'

export interface ApiKeyItem {
  client_id: string
  device_name: string | null
  created_time: string | null
  last_seen_at: string | null
}

export interface CreateApiKeyResponse extends ApiKeyItem {
  api_key: string
}

export function listApiKeys() {
  return request<ApiKeyItem[]>({
    method: 'GET',
    url: '/hasn/app/hasn/me/api-keys',
  })
}

export function createApiKey(name: string) {
  return request<CreateApiKeyResponse>({
    method: 'POST',
    url: '/hasn/app/hasn/me/api-keys',
    data: { name },
  })
}

export function deleteApiKey(clientId: string) {
  return request<void>({
    method: 'DELETE',
    url: `/hasn/app/hasn/me/api-keys/${clientId}`,
  })
}
