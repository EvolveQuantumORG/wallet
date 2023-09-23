import type { AxiosRequestConfig, InternalAxiosRequestConfig } from 'axios'

export interface MuRequestInterceptors {
  requestInterceptor?: (config: AxiosRequestConfig) => AxiosRequestConfig
  requestInterceptorCatch?: (error: any) => any
  responseInterceptor?: (res: any) => any
  responseInterceptorCatch?: (error: any) => any
}

export interface MuRequestConfig extends AxiosRequestConfig {
  interceptors?: MuRequestInterceptors
  isLoading?: boolean
  loadingText?: string
}

export interface MuInternalAxiosRequestConfig extends InternalAxiosRequestConfig {
  interceptors?: MuRequestInterceptors
  isLoading?: boolean
  loadingText?: string
}

export interface downloadRes {
  data: Blob
  name: string
  responseType: 'blob'
  size: number
}
