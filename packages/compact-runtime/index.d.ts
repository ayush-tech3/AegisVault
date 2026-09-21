export type WitnessContext<L, T> = any;
export type CircuitContext<T> = any;
export type ConstructorContext<T> = any;
export type CircuitResults<T, R> = { context: CircuitContext<T>; result: R };
export type ConstructorResult<T> = { currentContractState: any };
export type ContractStateMap<K, V> = Map<K, V>;
export type ContractStateSet<K> = Set<K>;
