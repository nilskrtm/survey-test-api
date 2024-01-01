export enum WebSocketDataType {
  SUBSCRIPTION = 'SUBSCRIPTION',
}

enum SubscriptionType {
  DASHBOARD_METRICS = 'DASHBOARD_METRICS',
}

export interface SubscriptionData {
  subscriptionType: SubscriptionType;
}

export interface WebSocketData<T = any> {
  type: WebSocketDataType;
  data: T;
}
