//@ts-nocheck
import { useQuery, UseQueryOptions } from "react-query";
import Wei, { WeiSource, wei } from "@synthetixio/wei";
import axios from "codegen-graph-ts/build/src/lib/axios";
import generateGql from "codegen-graph-ts/build/src/lib/gql";
import { NetworkId } from "constants/networks";
export type SingleQueryOptions = {
    id: string;
    block?: {
        "number": number;
    } | {
        hash: string;
    };
};
export type MultiQueryOptions<T, R> = {
    first?: number;
    where?: T;
    block?: {
        "number": number;
    } | {
        hash: string;
    };
    orderBy?: keyof R;
    orderDirection?: "asc" | "desc";
};
const MAX_PAGE = 1000;
export type AcceptDealFilter = {
    id?: string | null;
    id_not?: string | null;
    id_gt?: string | null;
    id_lt?: string | null;
    id_gte?: string | null;
    id_lte?: string | null;
    id_in?: string[];
    id_not_in?: string[];
    purchaser?: string | null;
    purchaser_not?: string | null;
    purchaser_in?: string[];
    purchaser_not_in?: string[];
    purchaser_contains?: string | null;
    purchaser_not_contains?: string | null;
    poolAddress?: string | null;
    poolAddress_not?: string | null;
    poolAddress_in?: string[];
    poolAddress_not_in?: string[];
    poolAddress_contains?: string | null;
    poolAddress_not_contains?: string | null;
    dealAddress?: string | null;
    dealAddress_not?: string | null;
    dealAddress_in?: string[];
    dealAddress_not_in?: string[];
    dealAddress_contains?: string | null;
    dealAddress_not_contains?: string | null;
    sponsorFee?: WeiSource | null;
    sponsorFee_not?: WeiSource | null;
    sponsorFee_gt?: WeiSource | null;
    sponsorFee_lt?: WeiSource | null;
    sponsorFee_gte?: WeiSource | null;
    sponsorFee_lte?: WeiSource | null;
    sponsorFee_in?: WeiSource[];
    sponsorFee_not_in?: WeiSource[];
    aelinFee?: WeiSource | null;
    aelinFee_not?: WeiSource | null;
    aelinFee_gt?: WeiSource | null;
    aelinFee_lt?: WeiSource | null;
    aelinFee_gte?: WeiSource | null;
    aelinFee_lte?: WeiSource | null;
    aelinFee_in?: WeiSource[];
    aelinFee_not_in?: WeiSource[];
    poolTokenAmount?: WeiSource | null;
    poolTokenAmount_not?: WeiSource | null;
    poolTokenAmount_gt?: WeiSource | null;
    poolTokenAmount_lt?: WeiSource | null;
    poolTokenAmount_gte?: WeiSource | null;
    poolTokenAmount_lte?: WeiSource | null;
    poolTokenAmount_in?: WeiSource[];
    poolTokenAmount_not_in?: WeiSource[];
};
export type AcceptDealResult = {
    id: string;
    purchaser: string;
    poolAddress: string;
    dealAddress: string;
    sponsorFee: Wei;
    aelinFee: Wei;
    poolTokenAmount: Wei;
};
export type AcceptDealFields = {
    id: true;
    purchaser: true;
    poolAddress: true;
    dealAddress: true;
    sponsorFee: true;
    aelinFee: true;
    poolTokenAmount: true;
};
export type AcceptDealArgs<K extends keyof AcceptDealResult> = {
    [Property in keyof Pick<AcceptDealFields, K>]: AcceptDealFields[Property];
};
export const useGetAcceptDealById = <K extends keyof AcceptDealResult>(url: string, options?: SingleQueryOptions, args?: AcceptDealArgs<K>, queryOptions: UseQueryOptions<Pick<AcceptDealResult, K>> = {}) => {
    const func = async function <K extends keyof AcceptDealResult>(url: string, options: SingleQueryOptions, args: AcceptDealArgs<K>): Promise<Pick<AcceptDealResult, K>> {
        const res = await axios.post(url, {
            query: generateGql("acceptDeal", options, args)
        });
        const r = res.data as any;
        if (r.errors && r.errors.length) {
            throw new Error(r.errors[0].message);
        }
        const obj = (r.data[Object.keys(r.data)[0]] as any);
        const formattedObj: any = {};
        if (obj["id"])
            formattedObj["id"] = obj["id"];
        if (obj["purchaser"])
            formattedObj["purchaser"] = obj["purchaser"];
        if (obj["poolAddress"])
            formattedObj["poolAddress"] = obj["poolAddress"];
        if (obj["dealAddress"])
            formattedObj["dealAddress"] = obj["dealAddress"];
        if (obj["sponsorFee"])
            formattedObj["sponsorFee"] = wei(obj["sponsorFee"], 0);
        if (obj["aelinFee"])
            formattedObj["aelinFee"] = wei(obj["aelinFee"], 0);
        if (obj["poolTokenAmount"])
            formattedObj["poolTokenAmount"] = wei(obj["poolTokenAmount"], 0);
        return formattedObj as Pick<AcceptDealResult, K>;
    };
    const enabled = options && args;
    return useQuery(["codegen-graphql", enabled ? generateGql("AcceptDeal", options, args) : null], async () => func(url, options!, args!), {
        ...queryOptions,
        enabled: !!options && !!args,
    });
};
export const useGetAcceptDeals = <K extends keyof AcceptDealResult>(url: string, options?: MultiQueryOptions<AcceptDealFilter, AcceptDealResult>, args?: AcceptDealArgs<K>, queryOptions: UseQueryOptions<Pick<AcceptDealResult, K>[]> = {}) => {
    const func = async function <K extends keyof AcceptDealResult>(url: string, options: MultiQueryOptions<AcceptDealFilter, AcceptDealResult>, args: AcceptDealArgs<K>): Promise<Pick<AcceptDealResult, K>[]> {
        const paginatedOptions: Partial<MultiQueryOptions<AcceptDealFilter, AcceptDealResult>> = { ...options };
        let paginationKey: keyof AcceptDealFilter | null = null;
        let paginationValue = "";
        if (options.first && options.first > MAX_PAGE) {
            paginatedOptions.first = MAX_PAGE;
            paginatedOptions.orderBy = options.orderBy || "id";
            paginatedOptions.orderDirection = options.orderDirection || "asc";
            paginationKey = paginatedOptions.orderBy + (paginatedOptions.orderDirection === "asc" ? "_gt" : "_lt") as keyof AcceptDealFilter;
            paginatedOptions.where = { ...options.where };
        }
        let results: Pick<AcceptDealResult, K>[] = [];
        do {
            if (paginationKey && paginationValue)
                paginatedOptions.where![paginationKey] = paginationValue as any;
            const res = await axios.post(url, {
                query: generateGql("acceptDeals", paginatedOptions, args)
            });
            const r = res.data as any;
            if (r.errors && r.errors.length) {
                throw new Error(r.errors[0].message);
            }
            const rawResults = r.data[Object.keys(r.data)[0]] as any[];
            const newResults = rawResults.map((obj) => {
                const formattedObj: any = {};
                if (obj["id"])
                    formattedObj["id"] = obj["id"];
                if (obj["purchaser"])
                    formattedObj["purchaser"] = obj["purchaser"];
                if (obj["poolAddress"])
                    formattedObj["poolAddress"] = obj["poolAddress"];
                if (obj["dealAddress"])
                    formattedObj["dealAddress"] = obj["dealAddress"];
                if (obj["sponsorFee"])
                    formattedObj["sponsorFee"] = wei(obj["sponsorFee"], 0);
                if (obj["aelinFee"])
                    formattedObj["aelinFee"] = wei(obj["aelinFee"], 0);
                if (obj["poolTokenAmount"])
                    formattedObj["poolTokenAmount"] = wei(obj["poolTokenAmount"], 0);
                return formattedObj as Pick<AcceptDealResult, K>;
            });
            results = results.concat(newResults);
            if (newResults.length < 1000) {
                break;
            }
            if (paginationKey) {
                paginationValue = rawResults[rawResults.length - 1][paginatedOptions.orderBy!];
            }
        } while (paginationKey && (options.first && results.length < options.first));
        return options.first ? results.slice(0, options.first) : results;
    };
    const enabled = options && args;
    return useQuery(["codegen-graphql", enabled ? generateGql("AcceptDeals", options, args) : null], async () => func(url, options!, args!), {
        ...queryOptions,
        enabled: !!options && !!args,
    });
};
export type AelinTokenFilter = {
    id?: string | null;
    id_not?: string | null;
    id_gt?: string | null;
    id_lt?: string | null;
    id_gte?: string | null;
    id_lte?: string | null;
    id_in?: string[];
    id_not_in?: string[];
    name?: string | null;
    name_not?: string | null;
    name_gt?: string | null;
    name_lt?: string | null;
    name_gte?: string | null;
    name_lte?: string | null;
    name_in?: string[];
    name_not_in?: string[];
    name_contains?: string | null;
    name_not_contains?: string | null;
    name_starts_with?: string | null;
    name_not_starts_with?: string | null;
    name_ends_with?: string | null;
    name_not_ends_with?: string | null;
    symbol?: string | null;
    symbol_not?: string | null;
    symbol_gt?: string | null;
    symbol_lt?: string | null;
    symbol_gte?: string | null;
    symbol_lte?: string | null;
    symbol_in?: string[];
    symbol_not_in?: string[];
    symbol_contains?: string | null;
    symbol_not_contains?: string | null;
    symbol_starts_with?: string | null;
    symbol_not_starts_with?: string | null;
    symbol_ends_with?: string | null;
    symbol_not_ends_with?: string | null;
    decimals?: number | null;
    decimals_not?: number | null;
    decimals_gt?: number | null;
    decimals_lt?: number | null;
    decimals_gte?: number | null;
    decimals_lte?: number | null;
    decimals_in?: number[];
    decimals_not_in?: number[];
};
export type AelinTokenResult = {
    id: string;
    name: string;
    symbol: string;
    decimals: number;
};
export type AelinTokenFields = {
    id: true;
    name: true;
    symbol: true;
    decimals: true;
};
export type AelinTokenArgs<K extends keyof AelinTokenResult> = {
    [Property in keyof Pick<AelinTokenFields, K>]: AelinTokenFields[Property];
};
export const useGetAelinTokenById = <K extends keyof AelinTokenResult>(url: string, options?: SingleQueryOptions, args?: AelinTokenArgs<K>, queryOptions: UseQueryOptions<Pick<AelinTokenResult, K>> = {}) => {
    const func = async function <K extends keyof AelinTokenResult>(url: string, options: SingleQueryOptions, args: AelinTokenArgs<K>): Promise<Pick<AelinTokenResult, K>> {
        const res = await axios.post(url, {
            query: generateGql("aelinToken", options, args)
        });
        const r = res.data as any;
        if (r.errors && r.errors.length) {
            throw new Error(r.errors[0].message);
        }
        const obj = (r.data[Object.keys(r.data)[0]] as any);
        const formattedObj: any = {};
        if (obj["id"])
            formattedObj["id"] = obj["id"];
        if (obj["name"])
            formattedObj["name"] = obj["name"];
        if (obj["symbol"])
            formattedObj["symbol"] = obj["symbol"];
        if (obj["decimals"])
            formattedObj["decimals"] = obj["decimals"];
        return formattedObj as Pick<AelinTokenResult, K>;
    };
    const enabled = options && args;
    return useQuery(["codegen-graphql", enabled ? generateGql("AelinToken", options, args) : null], async () => func(url, options!, args!), {
        ...queryOptions,
        enabled: !!options && !!args,
    });
};
export const useGetAelinTokens = <K extends keyof AelinTokenResult>(url: string, options?: MultiQueryOptions<AelinTokenFilter, AelinTokenResult>, args?: AelinTokenArgs<K>, queryOptions: UseQueryOptions<Pick<AelinTokenResult, K>[]> = {}) => {
    const func = async function <K extends keyof AelinTokenResult>(url: string, options: MultiQueryOptions<AelinTokenFilter, AelinTokenResult>, args: AelinTokenArgs<K>): Promise<Pick<AelinTokenResult, K>[]> {
        const paginatedOptions: Partial<MultiQueryOptions<AelinTokenFilter, AelinTokenResult>> = { ...options };
        let paginationKey: keyof AelinTokenFilter | null = null;
        let paginationValue = "";
        if (options.first && options.first > MAX_PAGE) {
            paginatedOptions.first = MAX_PAGE;
            paginatedOptions.orderBy = options.orderBy || "id";
            paginatedOptions.orderDirection = options.orderDirection || "asc";
            paginationKey = paginatedOptions.orderBy + (paginatedOptions.orderDirection === "asc" ? "_gt" : "_lt") as keyof AelinTokenFilter;
            paginatedOptions.where = { ...options.where };
        }
        let results: Pick<AelinTokenResult, K>[] = [];
        do {
            if (paginationKey && paginationValue)
                paginatedOptions.where![paginationKey] = paginationValue as any;
            const res = await axios.post(url, {
                query: generateGql("aelinTokens", paginatedOptions, args)
            });
            const r = res.data as any;
            if (r.errors && r.errors.length) {
                throw new Error(r.errors[0].message);
            }
            const rawResults = r.data[Object.keys(r.data)[0]] as any[];
            const newResults = rawResults.map((obj) => {
                const formattedObj: any = {};
                if (obj["id"])
                    formattedObj["id"] = obj["id"];
                if (obj["name"])
                    formattedObj["name"] = obj["name"];
                if (obj["symbol"])
                    formattedObj["symbol"] = obj["symbol"];
                if (obj["decimals"])
                    formattedObj["decimals"] = obj["decimals"];
                return formattedObj as Pick<AelinTokenResult, K>;
            });
            results = results.concat(newResults);
            if (newResults.length < 1000) {
                break;
            }
            if (paginationKey) {
                paginationValue = rawResults[rawResults.length - 1][paginatedOptions.orderBy!];
            }
        } while (paginationKey && (options.first && results.length < options.first));
        return options.first ? results.slice(0, options.first) : results;
    };
    const enabled = options && args;
    return useQuery(["codegen-graphql", enabled ? generateGql("AelinTokens", options, args) : null], async () => func(url, options!, args!), {
        ...queryOptions,
        enabled: !!options && !!args,
    });
};
export type ClaimedUnderlyingDealTokenFilter = {
    id?: string | null;
    id_not?: string | null;
    id_gt?: string | null;
    id_lt?: string | null;
    id_gte?: string | null;
    id_lte?: string | null;
    id_in?: string[];
    id_not_in?: string[];
    underlyingDealTokenAddress?: string | null;
    underlyingDealTokenAddress_not?: string | null;
    underlyingDealTokenAddress_in?: string[];
    underlyingDealTokenAddress_not_in?: string[];
    underlyingDealTokenAddress_contains?: string | null;
    underlyingDealTokenAddress_not_contains?: string | null;
    recipient?: string | null;
    recipient_not?: string | null;
    recipient_in?: string[];
    recipient_not_in?: string[];
    recipient_contains?: string | null;
    recipient_not_contains?: string | null;
    underlyingDealTokensClaimed?: WeiSource | null;
    underlyingDealTokensClaimed_not?: WeiSource | null;
    underlyingDealTokensClaimed_gt?: WeiSource | null;
    underlyingDealTokensClaimed_lt?: WeiSource | null;
    underlyingDealTokensClaimed_gte?: WeiSource | null;
    underlyingDealTokensClaimed_lte?: WeiSource | null;
    underlyingDealTokensClaimed_in?: WeiSource[];
    underlyingDealTokensClaimed_not_in?: WeiSource[];
    dealAddress?: string | null;
    dealAddress_not?: string | null;
    dealAddress_in?: string[];
    dealAddress_not_in?: string[];
    dealAddress_contains?: string | null;
    dealAddress_not_contains?: string | null;
};
export type ClaimedUnderlyingDealTokenResult = {
    id: string;
    underlyingDealTokenAddress: string;
    recipient: string;
    underlyingDealTokensClaimed: Wei;
    dealAddress: string;
};
export type ClaimedUnderlyingDealTokenFields = {
    id: true;
    underlyingDealTokenAddress: true;
    recipient: true;
    underlyingDealTokensClaimed: true;
    dealAddress: true;
};
export type ClaimedUnderlyingDealTokenArgs<K extends keyof ClaimedUnderlyingDealTokenResult> = {
    [Property in keyof Pick<ClaimedUnderlyingDealTokenFields, K>]: ClaimedUnderlyingDealTokenFields[Property];
};
export const useGetClaimedUnderlyingDealTokenById = <K extends keyof ClaimedUnderlyingDealTokenResult>(url: string, options?: SingleQueryOptions, args?: ClaimedUnderlyingDealTokenArgs<K>, queryOptions: UseQueryOptions<Pick<ClaimedUnderlyingDealTokenResult, K>> = {}, networkId: NetworkId) => {
    const func = async function <K extends keyof ClaimedUnderlyingDealTokenResult>(url: string, options: SingleQueryOptions, args: ClaimedUnderlyingDealTokenArgs<K>): Promise<Pick<ClaimedUnderlyingDealTokenResult, K>> {
        const res = await axios.post(url, {
            query: generateGql("claimedUnderlyingDealToken", options, args)
        });
        const r = res.data as any;
        if (r.errors && r.errors.length) {
            throw new Error(r.errors[0].message);
        }
        const obj = (r.data[Object.keys(r.data)[0]] as any);
        const formattedObj: any = {};
        if (obj["id"])
            formattedObj["id"] = obj["id"];
        if (obj["underlyingDealTokenAddress"])
            formattedObj["underlyingDealTokenAddress"] = obj["underlyingDealTokenAddress"];
        if (obj["recipient"])
            formattedObj["recipient"] = obj["recipient"];
        if (obj["underlyingDealTokensClaimed"])
            formattedObj["underlyingDealTokensClaimed"] = wei(obj["underlyingDealTokensClaimed"], 0);
        if (obj["dealAddress"])
            formattedObj["dealAddress"] = obj["dealAddress"];
        return formattedObj as Pick<ClaimedUnderlyingDealTokenResult, K>;
    };
    const enabled = options && args;
    return useQuery(["codegen-graphql", enabled ? generateGql("ClaimedUnderlyingDealToken", options, args) : null, networkId], async () => func(url, options!, args!), {
        ...queryOptions,
        enabled: !!options && !!args,
    });
};
export const useGetClaimedUnderlyingDealTokens = <K extends keyof ClaimedUnderlyingDealTokenResult>(url: string, options?: MultiQueryOptions<ClaimedUnderlyingDealTokenFilter, ClaimedUnderlyingDealTokenResult>, args?: ClaimedUnderlyingDealTokenArgs<K>, queryOptions: UseQueryOptions<Pick<ClaimedUnderlyingDealTokenResult, K>[]> = {}, networkId: NetworkId) => {
    const func = async function <K extends keyof ClaimedUnderlyingDealTokenResult>(url: string, options: MultiQueryOptions<ClaimedUnderlyingDealTokenFilter, ClaimedUnderlyingDealTokenResult>, args: ClaimedUnderlyingDealTokenArgs<K>): Promise<Pick<ClaimedUnderlyingDealTokenResult, K>[]> {
        const paginatedOptions: Partial<MultiQueryOptions<ClaimedUnderlyingDealTokenFilter, ClaimedUnderlyingDealTokenResult>> = { ...options };
        let paginationKey: keyof ClaimedUnderlyingDealTokenFilter | null = null;
        let paginationValue = "";
        if (options.first && options.first > MAX_PAGE) {
            paginatedOptions.first = MAX_PAGE;
            paginatedOptions.orderBy = options.orderBy || "id";
            paginatedOptions.orderDirection = options.orderDirection || "asc";
            paginationKey = paginatedOptions.orderBy + (paginatedOptions.orderDirection === "asc" ? "_gt" : "_lt") as keyof ClaimedUnderlyingDealTokenFilter;
            paginatedOptions.where = { ...options.where };
        }
        let results: Pick<ClaimedUnderlyingDealTokenResult, K>[] = [];
        do {
            if (paginationKey && paginationValue)
                paginatedOptions.where![paginationKey] = paginationValue as any;
            const res = await axios.post(url, {
                query: generateGql("claimedUnderlyingDealTokens", paginatedOptions, args)
            });
            const r = res.data as any;
            if (r.errors && r.errors.length) {
                throw new Error(r.errors[0].message);
            }
            const rawResults = r.data[Object.keys(r.data)[0]] as any[];
            const newResults = rawResults.map((obj) => {
                const formattedObj: any = {};
                if (obj["id"])
                    formattedObj["id"] = obj["id"];
                if (obj["underlyingDealTokenAddress"])
                    formattedObj["underlyingDealTokenAddress"] = obj["underlyingDealTokenAddress"];
                if (obj["recipient"])
                    formattedObj["recipient"] = obj["recipient"];
                if (obj["underlyingDealTokensClaimed"])
                    formattedObj["underlyingDealTokensClaimed"] = wei(obj["underlyingDealTokensClaimed"], 0);
                if (obj["dealAddress"])
                    formattedObj["dealAddress"] = obj["dealAddress"];
                return formattedObj as Pick<ClaimedUnderlyingDealTokenResult, K>;
            });
            results = results.concat(newResults);
            if (newResults.length < 1000) {
                break;
            }
            if (paginationKey) {
                paginationValue = rawResults[rawResults.length - 1][paginatedOptions.orderBy!];
            }
        } while (paginationKey && (options.first && results.length < options.first));
        return options.first ? results.slice(0, options.first) : results;
    };
    const enabled = options && args;
    return useQuery(["codegen-graphql", enabled ? generateGql("ClaimedUnderlyingDealTokens", options, args) : null, networkId], async () => func(url, options!, args!), {
        ...queryOptions,
        enabled: !!options && !!args,
    });
};
export type DealCreatedFilter = {
    id?: string | null;
    id_not?: string | null;
    id_gt?: string | null;
    id_lt?: string | null;
    id_gte?: string | null;
    id_lte?: string | null;
    id_in?: string[];
    id_not_in?: string[];
    name?: string | null;
    name_not?: string | null;
    name_gt?: string | null;
    name_lt?: string | null;
    name_gte?: string | null;
    name_lte?: string | null;
    name_in?: string[];
    name_not_in?: string[];
    name_contains?: string | null;
    name_not_contains?: string | null;
    name_starts_with?: string | null;
    name_not_starts_with?: string | null;
    name_ends_with?: string | null;
    name_not_ends_with?: string | null;
    symbol?: string | null;
    symbol_not?: string | null;
    symbol_gt?: string | null;
    symbol_lt?: string | null;
    symbol_gte?: string | null;
    symbol_lte?: string | null;
    symbol_in?: string[];
    symbol_not_in?: string[];
    symbol_contains?: string | null;
    symbol_not_contains?: string | null;
    symbol_starts_with?: string | null;
    symbol_not_starts_with?: string | null;
    symbol_ends_with?: string | null;
    symbol_not_ends_with?: string | null;
    poolAddress?: string | null;
    poolAddress_not?: string | null;
    poolAddress_in?: string[];
    poolAddress_not_in?: string[];
    poolAddress_contains?: string | null;
    poolAddress_not_contains?: string | null;
    sponsor?: string | null;
    sponsor_not?: string | null;
    sponsor_in?: string[];
    sponsor_not_in?: string[];
    sponsor_contains?: string | null;
    sponsor_not_contains?: string | null;
};
export type DealCreatedResult = {
    id: string;
    name: string;
    symbol: string;
    poolAddress: string;
    sponsor: string;
};
export type DealCreatedFields = {
    id: true;
    name: true;
    symbol: true;
    poolAddress: true;
    sponsor: true;
};
export type DealCreatedArgs<K extends keyof DealCreatedResult> = {
    [Property in keyof Pick<DealCreatedFields, K>]: DealCreatedFields[Property];
};
export const useGetDealCreatedById = <K extends keyof DealCreatedResult>(url: string, options?: SingleQueryOptions, args?: DealCreatedArgs<K>, queryOptions: UseQueryOptions<Pick<DealCreatedResult, K>> = {}, networkId: NetworkId) => {
    const func = async function <K extends keyof DealCreatedResult>(url: string, options: SingleQueryOptions, args: DealCreatedArgs<K>): Promise<Pick<DealCreatedResult, K>> {
        const res = await axios.post(url, {
            query: generateGql("dealCreated", options, args)
        });
        const r = res.data as any;
        if (r.errors && r.errors.length) {
            throw new Error(r.errors[0].message);
        }
        const obj = (r.data[Object.keys(r.data)[0]] as any);
        const formattedObj: any = {};
        if (obj["id"])
            formattedObj["id"] = obj["id"];
        if (obj["name"])
            formattedObj["name"] = obj["name"];
        if (obj["symbol"])
            formattedObj["symbol"] = obj["symbol"];
        if (obj["poolAddress"])
            formattedObj["poolAddress"] = obj["poolAddress"];
        if (obj["sponsor"])
            formattedObj["sponsor"] = obj["sponsor"];
        return formattedObj as Pick<DealCreatedResult, K>;
    };
    const enabled = options && args;
    return useQuery(["codegen-graphql", enabled ? generateGql("DealCreated", options, args) : null, networkId], async () => func(url, options!, args!), {
        ...queryOptions,
        enabled: !!options && !!args,
    });
};
export const useGetDealCreateds = <K extends keyof DealCreatedResult>(url: string, options?: MultiQueryOptions<DealCreatedFilter, DealCreatedResult>, args?: DealCreatedArgs<K>, queryOptions: UseQueryOptions<Pick<DealCreatedResult, K>[]> = {}) => {
    const func = async function <K extends keyof DealCreatedResult>(url: string, options: MultiQueryOptions<DealCreatedFilter, DealCreatedResult>, args: DealCreatedArgs<K>): Promise<Pick<DealCreatedResult, K>[]> {
        const paginatedOptions: Partial<MultiQueryOptions<DealCreatedFilter, DealCreatedResult>> = { ...options };
        let paginationKey: keyof DealCreatedFilter | null = null;
        let paginationValue = "";
        if (options.first && options.first > MAX_PAGE) {
            paginatedOptions.first = MAX_PAGE;
            paginatedOptions.orderBy = options.orderBy || "id";
            paginatedOptions.orderDirection = options.orderDirection || "asc";
            paginationKey = paginatedOptions.orderBy + (paginatedOptions.orderDirection === "asc" ? "_gt" : "_lt") as keyof DealCreatedFilter;
            paginatedOptions.where = { ...options.where };
        }
        let results: Pick<DealCreatedResult, K>[] = [];
        do {
            if (paginationKey && paginationValue)
                paginatedOptions.where![paginationKey] = paginationValue as any;
            const res = await axios.post(url, {
                query: generateGql("dealCreateds", paginatedOptions, args)
            });
            const r = res.data as any;
            if (r.errors && r.errors.length) {
                throw new Error(r.errors[0].message);
            }
            const rawResults = r.data[Object.keys(r.data)[0]] as any[];
            const newResults = rawResults.map((obj) => {
                const formattedObj: any = {};
                if (obj["id"])
                    formattedObj["id"] = obj["id"];
                if (obj["name"])
                    formattedObj["name"] = obj["name"];
                if (obj["symbol"])
                    formattedObj["symbol"] = obj["symbol"];
                if (obj["poolAddress"])
                    formattedObj["poolAddress"] = obj["poolAddress"];
                if (obj["sponsor"])
                    formattedObj["sponsor"] = obj["sponsor"];
                return formattedObj as Pick<DealCreatedResult, K>;
            });
            results = results.concat(newResults);
            if (newResults.length < 1000) {
                break;
            }
            if (paginationKey) {
                paginationValue = rawResults[rawResults.length - 1][paginatedOptions.orderBy!];
            }
        } while (paginationKey && (options.first && results.length < options.first));
        return options.first ? results.slice(0, options.first) : results;
    };
    const enabled = options && args;
    return useQuery(["codegen-graphql", enabled ? generateGql("DealCreateds", options, args) : null], async () => func(url, options!, args!), {
        ...queryOptions,
        enabled: !!options && !!args,
    });
};
export type DealDetailFilter = {
    id?: string | null;
    id_not?: string | null;
    id_gt?: string | null;
    id_lt?: string | null;
    id_gte?: string | null;
    id_lte?: string | null;
    id_in?: string[];
    id_not_in?: string[];
    underlyingDealToken?: string | null;
    underlyingDealToken_not?: string | null;
    underlyingDealToken_in?: string[];
    underlyingDealToken_not_in?: string[];
    underlyingDealToken_contains?: string | null;
    underlyingDealToken_not_contains?: string | null;
    underlyingDealTokenSymbol?: string | null;
    underlyingDealTokenSymbol_not?: string | null;
    underlyingDealTokenSymbol_gt?: string | null;
    underlyingDealTokenSymbol_lt?: string | null;
    underlyingDealTokenSymbol_gte?: string | null;
    underlyingDealTokenSymbol_lte?: string | null;
    underlyingDealTokenSymbol_in?: string[];
    underlyingDealTokenSymbol_not_in?: string[];
    underlyingDealTokenSymbol_contains?: string | null;
    underlyingDealTokenSymbol_not_contains?: string | null;
    underlyingDealTokenSymbol_starts_with?: string | null;
    underlyingDealTokenSymbol_not_starts_with?: string | null;
    underlyingDealTokenSymbol_ends_with?: string | null;
    underlyingDealTokenSymbol_not_ends_with?: string | null;
    underlyingDealTokenDecimals?: number | null;
    underlyingDealTokenDecimals_not?: number | null;
    underlyingDealTokenDecimals_gt?: number | null;
    underlyingDealTokenDecimals_lt?: number | null;
    underlyingDealTokenDecimals_gte?: number | null;
    underlyingDealTokenDecimals_lte?: number | null;
    underlyingDealTokenDecimals_in?: number[];
    underlyingDealTokenDecimals_not_in?: number[];
    purchaseTokenTotalForDeal?: WeiSource | null;
    purchaseTokenTotalForDeal_not?: WeiSource | null;
    purchaseTokenTotalForDeal_gt?: WeiSource | null;
    purchaseTokenTotalForDeal_lt?: WeiSource | null;
    purchaseTokenTotalForDeal_gte?: WeiSource | null;
    purchaseTokenTotalForDeal_lte?: WeiSource | null;
    purchaseTokenTotalForDeal_in?: WeiSource[];
    purchaseTokenTotalForDeal_not_in?: WeiSource[];
    underlyingDealTokenTotal?: WeiSource | null;
    underlyingDealTokenTotal_not?: WeiSource | null;
    underlyingDealTokenTotal_gt?: WeiSource | null;
    underlyingDealTokenTotal_lt?: WeiSource | null;
    underlyingDealTokenTotal_gte?: WeiSource | null;
    underlyingDealTokenTotal_lte?: WeiSource | null;
    underlyingDealTokenTotal_in?: WeiSource[];
    underlyingDealTokenTotal_not_in?: WeiSource[];
    vestingPeriod?: WeiSource | null;
    vestingPeriod_not?: WeiSource | null;
    vestingPeriod_gt?: WeiSource | null;
    vestingPeriod_lt?: WeiSource | null;
    vestingPeriod_gte?: WeiSource | null;
    vestingPeriod_lte?: WeiSource | null;
    vestingPeriod_in?: WeiSource[];
    vestingPeriod_not_in?: WeiSource[];
    vestingCliff?: WeiSource | null;
    vestingCliff_not?: WeiSource | null;
    vestingCliff_gt?: WeiSource | null;
    vestingCliff_lt?: WeiSource | null;
    vestingCliff_gte?: WeiSource | null;
    vestingCliff_lte?: WeiSource | null;
    vestingCliff_in?: WeiSource[];
    vestingCliff_not_in?: WeiSource[];
    proRataRedemptionPeriod?: WeiSource | null;
    proRataRedemptionPeriod_not?: WeiSource | null;
    proRataRedemptionPeriod_gt?: WeiSource | null;
    proRataRedemptionPeriod_lt?: WeiSource | null;
    proRataRedemptionPeriod_gte?: WeiSource | null;
    proRataRedemptionPeriod_lte?: WeiSource | null;
    proRataRedemptionPeriod_in?: WeiSource[];
    proRataRedemptionPeriod_not_in?: WeiSource[];
    proRataRedemptionPeriodStart?: WeiSource | null;
    proRataRedemptionPeriodStart_not?: WeiSource | null;
    proRataRedemptionPeriodStart_gt?: WeiSource | null;
    proRataRedemptionPeriodStart_lt?: WeiSource | null;
    proRataRedemptionPeriodStart_gte?: WeiSource | null;
    proRataRedemptionPeriodStart_lte?: WeiSource | null;
    proRataRedemptionPeriodStart_in?: WeiSource[];
    proRataRedemptionPeriodStart_not_in?: WeiSource[];
    openRedemptionPeriod?: WeiSource | null;
    openRedemptionPeriod_not?: WeiSource | null;
    openRedemptionPeriod_gt?: WeiSource | null;
    openRedemptionPeriod_lt?: WeiSource | null;
    openRedemptionPeriod_gte?: WeiSource | null;
    openRedemptionPeriod_lte?: WeiSource | null;
    openRedemptionPeriod_in?: WeiSource[];
    openRedemptionPeriod_not_in?: WeiSource[];
    holder?: string | null;
    holder_not?: string | null;
    holder_in?: string[];
    holder_not_in?: string[];
    holder_contains?: string | null;
    holder_not_contains?: string | null;
    isDealFunded?: boolean | null;
    isDealFunded_not?: boolean | null;
    isDealFunded_in?: boolean[];
    isDealFunded_not_in?: boolean[];
    holderFundingExpiration?: WeiSource | null;
    holderFundingExpiration_not?: WeiSource | null;
    holderFundingExpiration_gt?: WeiSource | null;
    holderFundingExpiration_lt?: WeiSource | null;
    holderFundingExpiration_gte?: WeiSource | null;
    holderFundingExpiration_lte?: WeiSource | null;
    holderFundingExpiration_in?: WeiSource[];
    holderFundingExpiration_not_in?: WeiSource[];
    holderFundingDuration?: WeiSource | null;
    holderFundingDuration_not?: WeiSource | null;
    holderFundingDuration_gt?: WeiSource | null;
    holderFundingDuration_lt?: WeiSource | null;
    holderFundingDuration_gte?: WeiSource | null;
    holderFundingDuration_lte?: WeiSource | null;
    holderFundingDuration_in?: WeiSource[];
    holderFundingDuration_not_in?: WeiSource[];
};
export type DealDetailResult = {
    id: string;
    underlyingDealToken: string;
    underlyingDealTokenSymbol: string;
    underlyingDealTokenDecimals: number;
    purchaseTokenTotalForDeal: Wei;
    underlyingDealTokenTotal: Wei;
    vestingPeriod: Wei;
    vestingCliff: Wei;
    proRataRedemptionPeriod: Wei;
    proRataRedemptionPeriodStart: Wei | null;
    openRedemptionPeriod: Wei;
    holder: string;
    isDealFunded: boolean;
    holderFundingExpiration: Wei;
    holderFundingDuration: Wei;
};
export type DealDetailFields = {
    id: true;
    underlyingDealToken: true;
    underlyingDealTokenSymbol: true;
    underlyingDealTokenDecimals: true;
    purchaseTokenTotalForDeal: true;
    underlyingDealTokenTotal: true;
    vestingPeriod: true;
    vestingCliff: true;
    proRataRedemptionPeriod: true;
    proRataRedemptionPeriodStart: true;
    openRedemptionPeriod: true;
    holder: true;
    isDealFunded: true;
    holderFundingExpiration: true;
    holderFundingDuration: true;
};
export type DealDetailArgs<K extends keyof DealDetailResult> = {
    [Property in keyof Pick<DealDetailFields, K>]: DealDetailFields[Property];
};
export const useGetDealDetailById = <K extends keyof DealDetailResult>(url: string, options?: SingleQueryOptions, args?: DealDetailArgs<K>, queryOptions: UseQueryOptions<Pick<DealDetailResult, K>> = {}, networkId: NetworkId) => {
    const func = async function <K extends keyof DealDetailResult>(url: string, options: SingleQueryOptions, args: DealDetailArgs<K>): Promise<Pick<DealDetailResult, K>> {
        const res = await axios.post(url, {
            query: generateGql("dealDetail", options, args)
        });
        const r = res.data as any;
        if (r.errors && r.errors.length) {
            throw new Error(r.errors[0].message);
        }
        const obj = (r.data[Object.keys(r.data)[0]] as any);
        const formattedObj: any = {};
        if (obj["id"])
            formattedObj["id"] = obj["id"];
        if (obj["underlyingDealToken"])
            formattedObj["underlyingDealToken"] = obj["underlyingDealToken"];
        if (obj["underlyingDealTokenSymbol"])
            formattedObj["underlyingDealTokenSymbol"] = obj["underlyingDealTokenSymbol"];
        if (obj["underlyingDealTokenDecimals"])
            formattedObj["underlyingDealTokenDecimals"] = obj["underlyingDealTokenDecimals"];
        if (obj["purchaseTokenTotalForDeal"])
            formattedObj["purchaseTokenTotalForDeal"] = wei(obj["purchaseTokenTotalForDeal"], 0);
        if (obj["underlyingDealTokenTotal"])
            formattedObj["underlyingDealTokenTotal"] = wei(obj["underlyingDealTokenTotal"], 0);
        if (obj["vestingPeriod"])
            formattedObj["vestingPeriod"] = wei(obj["vestingPeriod"], 0);
        if (obj["vestingCliff"])
            formattedObj["vestingCliff"] = wei(obj["vestingCliff"], 0);
        if (obj["proRataRedemptionPeriod"])
            formattedObj["proRataRedemptionPeriod"] = wei(obj["proRataRedemptionPeriod"], 0);
        if (obj["proRataRedemptionPeriodStart"])
            formattedObj["proRataRedemptionPeriodStart"] = wei(obj["proRataRedemptionPeriodStart"], 0);
        if (obj["openRedemptionPeriod"])
            formattedObj["openRedemptionPeriod"] = wei(obj["openRedemptionPeriod"], 0);
        if (obj["holder"])
            formattedObj["holder"] = obj["holder"];
        if (obj["isDealFunded"])
            formattedObj["isDealFunded"] = obj["isDealFunded"];
        if (obj["holderFundingExpiration"])
            formattedObj["holderFundingExpiration"] = wei(obj["holderFundingExpiration"], 0);
        if (obj["holderFundingDuration"])
            formattedObj["holderFundingDuration"] = wei(obj["holderFundingDuration"], 0);
        return formattedObj as Pick<DealDetailResult, K>;
    };
    const enabled = options && args;
    return useQuery(["codegen-graphql", enabled ? generateGql("DealDetail", options, args) : null, networkId], async () => func(url, options!, args!), {
        ...queryOptions,
        enabled: !!options && !!args,
    });
};
export const useGetDealDetails = <K extends keyof DealDetailResult>(url: string, options?: MultiQueryOptions<DealDetailFilter, DealDetailResult>, args?: DealDetailArgs<K>, queryOptions: UseQueryOptions<Pick<DealDetailResult, K>[]> = {}) => {
    const func = async function <K extends keyof DealDetailResult>(url: string, options: MultiQueryOptions<DealDetailFilter, DealDetailResult>, args: DealDetailArgs<K>): Promise<Pick<DealDetailResult, K>[]> {
        const paginatedOptions: Partial<MultiQueryOptions<DealDetailFilter, DealDetailResult>> = { ...options };
        let paginationKey: keyof DealDetailFilter | null = null;
        let paginationValue = "";
        if (options.first && options.first > MAX_PAGE) {
            paginatedOptions.first = MAX_PAGE;
            paginatedOptions.orderBy = options.orderBy || "id";
            paginatedOptions.orderDirection = options.orderDirection || "asc";
            paginationKey = paginatedOptions.orderBy + (paginatedOptions.orderDirection === "asc" ? "_gt" : "_lt") as keyof DealDetailFilter;
            paginatedOptions.where = { ...options.where };
        }
        let results: Pick<DealDetailResult, K>[] = [];
        do {
            if (paginationKey && paginationValue)
                paginatedOptions.where![paginationKey] = paginationValue as any;
            const res = await axios.post(url, {
                query: generateGql("dealDetails", paginatedOptions, args)
            });
            const r = res.data as any;
            if (r.errors && r.errors.length) {
                throw new Error(r.errors[0].message);
            }
            const rawResults = r.data[Object.keys(r.data)[0]] as any[];
            const newResults = rawResults.map((obj) => {
                const formattedObj: any = {};
                if (obj["id"])
                    formattedObj["id"] = obj["id"];
                if (obj["underlyingDealToken"])
                    formattedObj["underlyingDealToken"] = obj["underlyingDealToken"];
                if (obj["underlyingDealTokenSymbol"])
                    formattedObj["underlyingDealTokenSymbol"] = obj["underlyingDealTokenSymbol"];
                if (obj["underlyingDealTokenDecimals"])
                    formattedObj["underlyingDealTokenDecimals"] = obj["underlyingDealTokenDecimals"];
                if (obj["purchaseTokenTotalForDeal"])
                    formattedObj["purchaseTokenTotalForDeal"] = wei(obj["purchaseTokenTotalForDeal"], 0);
                if (obj["underlyingDealTokenTotal"])
                    formattedObj["underlyingDealTokenTotal"] = wei(obj["underlyingDealTokenTotal"], 0);
                if (obj["vestingPeriod"])
                    formattedObj["vestingPeriod"] = wei(obj["vestingPeriod"], 0);
                if (obj["vestingCliff"])
                    formattedObj["vestingCliff"] = wei(obj["vestingCliff"], 0);
                if (obj["proRataRedemptionPeriod"])
                    formattedObj["proRataRedemptionPeriod"] = wei(obj["proRataRedemptionPeriod"], 0);
                if (obj["proRataRedemptionPeriodStart"])
                    formattedObj["proRataRedemptionPeriodStart"] = wei(obj["proRataRedemptionPeriodStart"], 0);
                if (obj["openRedemptionPeriod"])
                    formattedObj["openRedemptionPeriod"] = wei(obj["openRedemptionPeriod"], 0);
                if (obj["holder"])
                    formattedObj["holder"] = obj["holder"];
                if (obj["isDealFunded"])
                    formattedObj["isDealFunded"] = obj["isDealFunded"];
                if (obj["holderFundingExpiration"])
                    formattedObj["holderFundingExpiration"] = wei(obj["holderFundingExpiration"], 0);
                if (obj["holderFundingDuration"])
                    formattedObj["holderFundingDuration"] = wei(obj["holderFundingDuration"], 0);
                return formattedObj as Pick<DealDetailResult, K>;
            });
            results = results.concat(newResults);
            if (newResults.length < 1000) {
                break;
            }
            if (paginationKey) {
                paginationValue = rawResults[rawResults.length - 1][paginatedOptions.orderBy!];
            }
        } while (paginationKey && (options.first && results.length < options.first));
        return options.first ? results.slice(0, options.first) : results;
    };
    const enabled = options && args;
    return useQuery(["codegen-graphql", enabled ? generateGql("DealDetails", options, args) : null], async () => func(url, options!, args!), {
        ...queryOptions,
        enabled: !!options && !!args,
    });
};
export type DealFullyFundedFilter = {
    id?: string | null;
    id_not?: string | null;
    id_gt?: string | null;
    id_lt?: string | null;
    id_gte?: string | null;
    id_lte?: string | null;
    id_in?: string[];
    id_not_in?: string[];
    poolAddress?: string | null;
    poolAddress_not?: string | null;
    poolAddress_in?: string[];
    poolAddress_not_in?: string[];
    poolAddress_contains?: string | null;
    poolAddress_not_contains?: string | null;
    proRataRedemptionStart?: WeiSource | null;
    proRataRedemptionStart_not?: WeiSource | null;
    proRataRedemptionStart_gt?: WeiSource | null;
    proRataRedemptionStart_lt?: WeiSource | null;
    proRataRedemptionStart_gte?: WeiSource | null;
    proRataRedemptionStart_lte?: WeiSource | null;
    proRataRedemptionStart_in?: WeiSource[];
    proRataRedemptionStart_not_in?: WeiSource[];
    openRedemptionStart?: WeiSource | null;
    openRedemptionStart_not?: WeiSource | null;
    openRedemptionStart_gt?: WeiSource | null;
    openRedemptionStart_lt?: WeiSource | null;
    openRedemptionStart_gte?: WeiSource | null;
    openRedemptionStart_lte?: WeiSource | null;
    openRedemptionStart_in?: WeiSource[];
    openRedemptionStart_not_in?: WeiSource[];
    proRataRedemptionExpiry?: WeiSource | null;
    proRataRedemptionExpiry_not?: WeiSource | null;
    proRataRedemptionExpiry_gt?: WeiSource | null;
    proRataRedemptionExpiry_lt?: WeiSource | null;
    proRataRedemptionExpiry_gte?: WeiSource | null;
    proRataRedemptionExpiry_lte?: WeiSource | null;
    proRataRedemptionExpiry_in?: WeiSource[];
    proRataRedemptionExpiry_not_in?: WeiSource[];
    openRedemptionExpiry?: WeiSource | null;
    openRedemptionExpiry_not?: WeiSource | null;
    openRedemptionExpiry_gt?: WeiSource | null;
    openRedemptionExpiry_lt?: WeiSource | null;
    openRedemptionExpiry_gte?: WeiSource | null;
    openRedemptionExpiry_lte?: WeiSource | null;
    openRedemptionExpiry_in?: WeiSource[];
    openRedemptionExpiry_not_in?: WeiSource[];
};
export type DealFullyFundedResult = {
    id: string;
    poolAddress: string;
    proRataRedemptionStart: Wei;
    openRedemptionStart: Wei;
    proRataRedemptionExpiry: Wei;
    openRedemptionExpiry: Wei;
};
export type DealFullyFundedFields = {
    id: true;
    poolAddress: true;
    proRataRedemptionStart: true;
    openRedemptionStart: true;
    proRataRedemptionExpiry: true;
    openRedemptionExpiry: true;
};
export type DealFullyFundedArgs<K extends keyof DealFullyFundedResult> = {
    [Property in keyof Pick<DealFullyFundedFields, K>]: DealFullyFundedFields[Property];
};
export const useGetDealFullyFundedById = <K extends keyof DealFullyFundedResult>(url: string, options?: SingleQueryOptions, args?: DealFullyFundedArgs<K>, queryOptions: UseQueryOptions<Pick<DealFullyFundedResult, K>> = {}) => {
    const func = async function <K extends keyof DealFullyFundedResult>(url: string, options: SingleQueryOptions, args: DealFullyFundedArgs<K>): Promise<Pick<DealFullyFundedResult, K>> {
        const res = await axios.post(url, {
            query: generateGql("dealFullyFunded", options, args)
        });
        const r = res.data as any;
        if (r.errors && r.errors.length) {
            throw new Error(r.errors[0].message);
        }
        const obj = (r.data[Object.keys(r.data)[0]] as any);
        const formattedObj: any = {};
        if (obj["id"])
            formattedObj["id"] = obj["id"];
        if (obj["poolAddress"])
            formattedObj["poolAddress"] = obj["poolAddress"];
        if (obj["proRataRedemptionStart"])
            formattedObj["proRataRedemptionStart"] = wei(obj["proRataRedemptionStart"], 0);
        if (obj["openRedemptionStart"])
            formattedObj["openRedemptionStart"] = wei(obj["openRedemptionStart"], 0);
        if (obj["proRataRedemptionExpiry"])
            formattedObj["proRataRedemptionExpiry"] = wei(obj["proRataRedemptionExpiry"], 0);
        if (obj["openRedemptionExpiry"])
            formattedObj["openRedemptionExpiry"] = wei(obj["openRedemptionExpiry"], 0);
        return formattedObj as Pick<DealFullyFundedResult, K>;
    };
    const enabled = options && args;
    return useQuery(["codegen-graphql", enabled ? generateGql("DealFullyFunded", options, args) : null], async () => func(url, options!, args!), {
        ...queryOptions,
        enabled: !!options && !!args,
    });
};
export const useGetDealFullyFundeds = <K extends keyof DealFullyFundedResult>(url: string, options?: MultiQueryOptions<DealFullyFundedFilter, DealFullyFundedResult>, args?: DealFullyFundedArgs<K>, queryOptions: UseQueryOptions<Pick<DealFullyFundedResult, K>[]> = {}) => {
    const func = async function <K extends keyof DealFullyFundedResult>(url: string, options: MultiQueryOptions<DealFullyFundedFilter, DealFullyFundedResult>, args: DealFullyFundedArgs<K>): Promise<Pick<DealFullyFundedResult, K>[]> {
        const paginatedOptions: Partial<MultiQueryOptions<DealFullyFundedFilter, DealFullyFundedResult>> = { ...options };
        let paginationKey: keyof DealFullyFundedFilter | null = null;
        let paginationValue = "";
        if (options.first && options.first > MAX_PAGE) {
            paginatedOptions.first = MAX_PAGE;
            paginatedOptions.orderBy = options.orderBy || "id";
            paginatedOptions.orderDirection = options.orderDirection || "asc";
            paginationKey = paginatedOptions.orderBy + (paginatedOptions.orderDirection === "asc" ? "_gt" : "_lt") as keyof DealFullyFundedFilter;
            paginatedOptions.where = { ...options.where };
        }
        let results: Pick<DealFullyFundedResult, K>[] = [];
        do {
            if (paginationKey && paginationValue)
                paginatedOptions.where![paginationKey] = paginationValue as any;
            const res = await axios.post(url, {
                query: generateGql("dealFullyFundeds", paginatedOptions, args)
            });
            const r = res.data as any;
            if (r.errors && r.errors.length) {
                throw new Error(r.errors[0].message);
            }
            const rawResults = r.data[Object.keys(r.data)[0]] as any[];
            const newResults = rawResults.map((obj) => {
                const formattedObj: any = {};
                if (obj["id"])
                    formattedObj["id"] = obj["id"];
                if (obj["poolAddress"])
                    formattedObj["poolAddress"] = obj["poolAddress"];
                if (obj["proRataRedemptionStart"])
                    formattedObj["proRataRedemptionStart"] = wei(obj["proRataRedemptionStart"], 0);
                if (obj["openRedemptionStart"])
                    formattedObj["openRedemptionStart"] = wei(obj["openRedemptionStart"], 0);
                if (obj["proRataRedemptionExpiry"])
                    formattedObj["proRataRedemptionExpiry"] = wei(obj["proRataRedemptionExpiry"], 0);
                if (obj["openRedemptionExpiry"])
                    formattedObj["openRedemptionExpiry"] = wei(obj["openRedemptionExpiry"], 0);
                return formattedObj as Pick<DealFullyFundedResult, K>;
            });
            results = results.concat(newResults);
            if (newResults.length < 1000) {
                break;
            }
            if (paginationKey) {
                paginationValue = rawResults[rawResults.length - 1][paginatedOptions.orderBy!];
            }
        } while (paginationKey && (options.first && results.length < options.first));
        return options.first ? results.slice(0, options.first) : results;
    };
    const enabled = options && args;
    return useQuery(["codegen-graphql", enabled ? generateGql("DealFullyFundeds", options, args) : null], async () => func(url, options!, args!), {
        ...queryOptions,
        enabled: !!options && !!args,
    });
};
export type DepositDealTokenFilter = {
    id?: string | null;
    id_not?: string | null;
    id_gt?: string | null;
    id_lt?: string | null;
    id_gte?: string | null;
    id_lte?: string | null;
    id_in?: string[];
    id_not_in?: string[];
    underlyingDealTokenAddress?: string | null;
    underlyingDealTokenAddress_not?: string | null;
    underlyingDealTokenAddress_in?: string[];
    underlyingDealTokenAddress_not_in?: string[];
    underlyingDealTokenAddress_contains?: string | null;
    underlyingDealTokenAddress_not_contains?: string | null;
    depositor?: string | null;
    depositor_not?: string | null;
    depositor_in?: string[];
    depositor_not_in?: string[];
    depositor_contains?: string | null;
    depositor_not_contains?: string | null;
    dealContract?: string | null;
    dealContract_not?: string | null;
    dealContract_in?: string[];
    dealContract_not_in?: string[];
    dealContract_contains?: string | null;
    dealContract_not_contains?: string | null;
    underlyingDealTokenAmount?: WeiSource | null;
    underlyingDealTokenAmount_not?: WeiSource | null;
    underlyingDealTokenAmount_gt?: WeiSource | null;
    underlyingDealTokenAmount_lt?: WeiSource | null;
    underlyingDealTokenAmount_gte?: WeiSource | null;
    underlyingDealTokenAmount_lte?: WeiSource | null;
    underlyingDealTokenAmount_in?: WeiSource[];
    underlyingDealTokenAmount_not_in?: WeiSource[];
};
export type DepositDealTokenResult = {
    id: string;
    underlyingDealTokenAddress: string;
    depositor: string;
    dealContract: string;
    underlyingDealTokenAmount: Wei;
};
export type DepositDealTokenFields = {
    id: true;
    underlyingDealTokenAddress: true;
    depositor: true;
    dealContract: true;
    underlyingDealTokenAmount: true;
};
export type DepositDealTokenArgs<K extends keyof DepositDealTokenResult> = {
    [Property in keyof Pick<DepositDealTokenFields, K>]: DepositDealTokenFields[Property];
};
export const useGetDepositDealTokenById = <K extends keyof DepositDealTokenResult>(url: string, options?: SingleQueryOptions, args?: DepositDealTokenArgs<K>, queryOptions: UseQueryOptions<Pick<DepositDealTokenResult, K>> = {}) => {
    const func = async function <K extends keyof DepositDealTokenResult>(url: string, options: SingleQueryOptions, args: DepositDealTokenArgs<K>): Promise<Pick<DepositDealTokenResult, K>> {
        const res = await axios.post(url, {
            query: generateGql("depositDealToken", options, args)
        });
        const r = res.data as any;
        if (r.errors && r.errors.length) {
            throw new Error(r.errors[0].message);
        }
        const obj = (r.data[Object.keys(r.data)[0]] as any);
        const formattedObj: any = {};
        if (obj["id"])
            formattedObj["id"] = obj["id"];
        if (obj["underlyingDealTokenAddress"])
            formattedObj["underlyingDealTokenAddress"] = obj["underlyingDealTokenAddress"];
        if (obj["depositor"])
            formattedObj["depositor"] = obj["depositor"];
        if (obj["dealContract"])
            formattedObj["dealContract"] = obj["dealContract"];
        if (obj["underlyingDealTokenAmount"])
            formattedObj["underlyingDealTokenAmount"] = wei(obj["underlyingDealTokenAmount"], 0);
        return formattedObj as Pick<DepositDealTokenResult, K>;
    };
    const enabled = options && args;
    return useQuery(["codegen-graphql", enabled ? generateGql("DepositDealToken", options, args) : null], async () => func(url, options!, args!), {
        ...queryOptions,
        enabled: !!options && !!args,
    });
};
export const useGetDepositDealTokens = <K extends keyof DepositDealTokenResult>(url: string, options?: MultiQueryOptions<DepositDealTokenFilter, DepositDealTokenResult>, args?: DepositDealTokenArgs<K>, queryOptions: UseQueryOptions<Pick<DepositDealTokenResult, K>[]> = {}) => {
    const func = async function <K extends keyof DepositDealTokenResult>(url: string, options: MultiQueryOptions<DepositDealTokenFilter, DepositDealTokenResult>, args: DepositDealTokenArgs<K>): Promise<Pick<DepositDealTokenResult, K>[]> {
        const paginatedOptions: Partial<MultiQueryOptions<DepositDealTokenFilter, DepositDealTokenResult>> = { ...options };
        let paginationKey: keyof DepositDealTokenFilter | null = null;
        let paginationValue = "";
        if (options.first && options.first > MAX_PAGE) {
            paginatedOptions.first = MAX_PAGE;
            paginatedOptions.orderBy = options.orderBy || "id";
            paginatedOptions.orderDirection = options.orderDirection || "asc";
            paginationKey = paginatedOptions.orderBy + (paginatedOptions.orderDirection === "asc" ? "_gt" : "_lt") as keyof DepositDealTokenFilter;
            paginatedOptions.where = { ...options.where };
        }
        let results: Pick<DepositDealTokenResult, K>[] = [];
        do {
            if (paginationKey && paginationValue)
                paginatedOptions.where![paginationKey] = paginationValue as any;
            const res = await axios.post(url, {
                query: generateGql("depositDealTokens", paginatedOptions, args)
            });
            const r = res.data as any;
            if (r.errors && r.errors.length) {
                throw new Error(r.errors[0].message);
            }
            const rawResults = r.data[Object.keys(r.data)[0]] as any[];
            const newResults = rawResults.map((obj) => {
                const formattedObj: any = {};
                if (obj["id"])
                    formattedObj["id"] = obj["id"];
                if (obj["underlyingDealTokenAddress"])
                    formattedObj["underlyingDealTokenAddress"] = obj["underlyingDealTokenAddress"];
                if (obj["depositor"])
                    formattedObj["depositor"] = obj["depositor"];
                if (obj["dealContract"])
                    formattedObj["dealContract"] = obj["dealContract"];
                if (obj["underlyingDealTokenAmount"])
                    formattedObj["underlyingDealTokenAmount"] = wei(obj["underlyingDealTokenAmount"], 0);
                return formattedObj as Pick<DepositDealTokenResult, K>;
            });
            results = results.concat(newResults);
            if (newResults.length < 1000) {
                break;
            }
            if (paginationKey) {
                paginationValue = rawResults[rawResults.length - 1][paginatedOptions.orderBy!];
            }
        } while (paginationKey && (options.first && results.length < options.first));
        return options.first ? results.slice(0, options.first) : results;
    };
    const enabled = options && args;
    return useQuery(["codegen-graphql", enabled ? generateGql("DepositDealTokens", options, args) : null], async () => func(url, options!, args!), {
        ...queryOptions,
        enabled: !!options && !!args,
    });
};
export type PoolCreatedFilter = {
    id?: string | null;
    id_not?: string | null;
    id_gt?: string | null;
    id_lt?: string | null;
    id_gte?: string | null;
    id_lte?: string | null;
    id_in?: string[];
    id_not_in?: string[];
    name?: string | null;
    name_not?: string | null;
    name_gt?: string | null;
    name_lt?: string | null;
    name_gte?: string | null;
    name_lte?: string | null;
    name_in?: string[];
    name_not_in?: string[];
    name_contains?: string | null;
    name_not_contains?: string | null;
    name_starts_with?: string | null;
    name_not_starts_with?: string | null;
    name_ends_with?: string | null;
    name_not_ends_with?: string | null;
    symbol?: string | null;
    symbol_not?: string | null;
    symbol_gt?: string | null;
    symbol_lt?: string | null;
    symbol_gte?: string | null;
    symbol_lte?: string | null;
    symbol_in?: string[];
    symbol_not_in?: string[];
    symbol_contains?: string | null;
    symbol_not_contains?: string | null;
    symbol_starts_with?: string | null;
    symbol_not_starts_with?: string | null;
    symbol_ends_with?: string | null;
    symbol_not_ends_with?: string | null;
    purchaseTokenCap?: WeiSource | null;
    purchaseTokenCap_not?: WeiSource | null;
    purchaseTokenCap_gt?: WeiSource | null;
    purchaseTokenCap_lt?: WeiSource | null;
    purchaseTokenCap_gte?: WeiSource | null;
    purchaseTokenCap_lte?: WeiSource | null;
    purchaseTokenCap_in?: WeiSource[];
    purchaseTokenCap_not_in?: WeiSource[];
    purchaseToken?: string | null;
    purchaseToken_not?: string | null;
    purchaseToken_in?: string[];
    purchaseToken_not_in?: string[];
    purchaseToken_contains?: string | null;
    purchaseToken_not_contains?: string | null;
    purchaseTokenSymbol?: string | null;
    purchaseTokenSymbol_not?: string | null;
    purchaseTokenSymbol_gt?: string | null;
    purchaseTokenSymbol_lt?: string | null;
    purchaseTokenSymbol_gte?: string | null;
    purchaseTokenSymbol_lte?: string | null;
    purchaseTokenSymbol_in?: string[];
    purchaseTokenSymbol_not_in?: string[];
    purchaseTokenSymbol_contains?: string | null;
    purchaseTokenSymbol_not_contains?: string | null;
    purchaseTokenSymbol_starts_with?: string | null;
    purchaseTokenSymbol_not_starts_with?: string | null;
    purchaseTokenSymbol_ends_with?: string | null;
    purchaseTokenSymbol_not_ends_with?: string | null;
    duration?: WeiSource | null;
    duration_not?: WeiSource | null;
    duration_gt?: WeiSource | null;
    duration_lt?: WeiSource | null;
    duration_gte?: WeiSource | null;
    duration_lte?: WeiSource | null;
    duration_in?: WeiSource[];
    duration_not_in?: WeiSource[];
    sponsorFee?: WeiSource | null;
    sponsorFee_not?: WeiSource | null;
    sponsorFee_gt?: WeiSource | null;
    sponsorFee_lt?: WeiSource | null;
    sponsorFee_gte?: WeiSource | null;
    sponsorFee_lte?: WeiSource | null;
    sponsorFee_in?: WeiSource[];
    sponsorFee_not_in?: WeiSource[];
    sponsor?: string | null;
    sponsor_not?: string | null;
    sponsor_in?: string[];
    sponsor_not_in?: string[];
    sponsor_contains?: string | null;
    sponsor_not_contains?: string | null;
    purchaseDuration?: WeiSource | null;
    purchaseDuration_not?: WeiSource | null;
    purchaseDuration_gt?: WeiSource | null;
    purchaseDuration_lt?: WeiSource | null;
    purchaseDuration_gte?: WeiSource | null;
    purchaseDuration_lte?: WeiSource | null;
    purchaseDuration_in?: WeiSource[];
    purchaseDuration_not_in?: WeiSource[];
    purchaseExpiry?: WeiSource | null;
    purchaseExpiry_not?: WeiSource | null;
    purchaseExpiry_gt?: WeiSource | null;
    purchaseExpiry_lt?: WeiSource | null;
    purchaseExpiry_gte?: WeiSource | null;
    purchaseExpiry_lte?: WeiSource | null;
    purchaseExpiry_in?: WeiSource[];
    purchaseExpiry_not_in?: WeiSource[];
    purchaseTokenDecimals?: number | null;
    purchaseTokenDecimals_not?: number | null;
    purchaseTokenDecimals_gt?: number | null;
    purchaseTokenDecimals_lt?: number | null;
    purchaseTokenDecimals_gte?: number | null;
    purchaseTokenDecimals_lte?: number | null;
    purchaseTokenDecimals_in?: number[];
    purchaseTokenDecimals_not_in?: number[];
    timestamp?: WeiSource | null;
    timestamp_not?: WeiSource | null;
    timestamp_gt?: WeiSource | null;
    timestamp_lt?: WeiSource | null;
    timestamp_gte?: WeiSource | null;
    timestamp_lte?: WeiSource | null;
    timestamp_in?: WeiSource[];
    timestamp_not_in?: WeiSource[];
		totalSupply?: WeiSource | null;
		totalSupply_not?: WeiSource | null;
		totalSupply_gt?: WeiSource | null;
		totalSupply_lt?: WeiSource | null;
		totalSupply_gte?: WeiSource | null;
		totalSupply_lte?: WeiSource | null;
		totalSupply_in?: WeiSource[];
		totalSupply_not_in?: WeiSource[];
    hasAllowList?: boolean | null;
    hasAllowList_not?: boolean | null;
    hasAllowList_in?: boolean[];
    hasAllowList_not_in?: boolean[];
    poolStatus?: PoolStatusFilter | null;
    poolStatus_not?: PoolStatusFilter | null;
    poolStatus_in?: PoolStatusFilter[];
    poolStatus_not_in?: PoolStatusFilter[];
    contributions?: WeiSource | null;
    contributions_not?: WeiSource | null;
    contributions_gt?: WeiSource | null;
    contributions_lt?: WeiSource | null;
    contributions_gte?: WeiSource | null;
    contributions_lte?: WeiSource | null;
    contributions_in?: WeiSource[];
    contributions_not_in?: WeiSource[];
    dealAddress?: string | null;
    dealAddress_not?: string | null;
    dealAddress_in?: string[];
    dealAddress_not_in?: string[];
    dealAddress_contains?: string | null;
    dealAddress_not_contains?: string | null;
};
export type PoolCreatedResult = {
    id: string;
    name: string;
    symbol: string;
    purchaseTokenCap: Wei;
    purchaseToken: string;
    purchaseTokenSymbol: string;
    duration: Wei;
    sponsorFee: Wei;
    sponsor: string;
    purchaseDuration: Wei;
    purchaseExpiry: Wei;
    purchaseTokenDecimals: number | null;
    timestamp: Wei;
    hasAllowList: boolean;
    poolStatus: Partial<PoolStatusResult>;
    contributions: Wei;
    totalSupply: Wei;
    dealAddress: string | null;
};
export type PoolCreatedFields = {
    id: true;
    name: true;
    symbol: true;
    purchaseTokenCap: true;
    purchaseToken: true;
    purchaseTokenSymbol: true;
    duration: true;
    sponsorFee: true;
    sponsor: true;
    purchaseDuration: true;
    purchaseExpiry: true;
    purchaseTokenDecimals: true;
    timestamp: true;
    hasAllowList: true;
    poolStatus: PoolStatusFields;
    contributions: true;
    totalSupply: true;
    dealAddress: true;
};
export type PoolCreatedArgs<K extends keyof PoolCreatedResult> = {
    [Property in keyof Pick<PoolCreatedFields, K>]: PoolCreatedFields[Property];
};
export const useGetPoolCreatedById = <K extends keyof PoolCreatedResult>(url: string, options?: SingleQueryOptions, args?: PoolCreatedArgs<K>, queryOptions: UseQueryOptions<Pick<PoolCreatedResult, K>> = {}, networkId: NetworkId) => {
    const func = async function <K extends keyof PoolCreatedResult>(url: string, options: SingleQueryOptions, args: PoolCreatedArgs<K>): Promise<Pick<PoolCreatedResult, K>> {
        const res = await axios.post(url, {
            query: generateGql("poolCreated", options, args)
        });
        const r = res.data as any;
        if (r.errors && r.errors.length) {
            throw new Error(r.errors[0].message);
        }
        const obj = (r.data[Object.keys(r.data)[0]] as any);
        const formattedObj: any = {};
        if (obj["id"])
            formattedObj["id"] = obj["id"];
        if (obj["name"])
            formattedObj["name"] = obj["name"];
        if (obj["symbol"])
            formattedObj["symbol"] = obj["symbol"];
        if (obj["purchaseTokenCap"])
            formattedObj["purchaseTokenCap"] = wei(obj["purchaseTokenCap"], 0);
        if (obj["purchaseToken"])
            formattedObj["purchaseToken"] = obj["purchaseToken"];
        if (obj["purchaseTokenSymbol"])
            formattedObj["purchaseTokenSymbol"] = obj["purchaseTokenSymbol"];
        if (obj["duration"])
            formattedObj["duration"] = wei(obj["duration"], 0);
        if (obj["sponsorFee"])
            formattedObj["sponsorFee"] = wei(obj["sponsorFee"], 0);
        if (obj["sponsor"])
            formattedObj["sponsor"] = obj["sponsor"];
        if (obj["purchaseDuration"])
            formattedObj["purchaseDuration"] = wei(obj["purchaseDuration"], 0);
        if (obj["purchaseExpiry"])
            formattedObj["purchaseExpiry"] = wei(obj["purchaseExpiry"], 0);
        if (obj["purchaseTokenDecimals"])
            formattedObj["purchaseTokenDecimals"] = obj["purchaseTokenDecimals"];
        if (obj["timestamp"])
            formattedObj["timestamp"] = wei(obj["timestamp"], 0);
        if (obj["hasAllowList"])
            formattedObj["hasAllowList"] = obj["hasAllowList"];
        if (obj["poolStatus"])
            formattedObj["poolStatus"] = obj["poolStatus"];
        if (obj["contributions"])
            formattedObj["contributions"] = wei(obj["contributions"], 0);
				if (obj["totalSupply"])
				    formattedObj["totalSupply"] = wei(obj["totalSupply"], 0);
        if (obj["dealAddress"])
            formattedObj["dealAddress"] = obj["dealAddress"];
        return formattedObj as Pick<PoolCreatedResult, K>;
    };
    const enabled = options && args;
    return useQuery(["codegen-graphql", enabled ? generateGql("PoolCreated", options, args) : null, networkId], async () => func(url, options!, args!), {
        ...queryOptions,
        enabled: !!options && !!args,
    });
};
export const useGetPoolCreateds = <K extends keyof PoolCreatedResult>(url: string, options?: MultiQueryOptions<PoolCreatedFilter, PoolCreatedResult>, args?: PoolCreatedArgs<K>, queryOptions: UseQueryOptions<Pick<PoolCreatedResult, K>[]> = {}, networkId: NetworkId) => {
    const func = async function <K extends keyof PoolCreatedResult>(url: string, options: MultiQueryOptions<PoolCreatedFilter, PoolCreatedResult>, args: PoolCreatedArgs<K>): Promise<Pick<PoolCreatedResult, K>[]> {
        const paginatedOptions: Partial<MultiQueryOptions<PoolCreatedFilter, PoolCreatedResult>> = { ...options };
        let paginationKey: keyof PoolCreatedFilter | null = null;
        let paginationValue = "";
        if (options.first && options.first > MAX_PAGE) {
            paginatedOptions.first = MAX_PAGE;
            paginatedOptions.orderBy = options.orderBy || "id";
            paginatedOptions.orderDirection = options.orderDirection || "asc";
            paginationKey = paginatedOptions.orderBy + (paginatedOptions.orderDirection === "asc" ? "_gt" : "_lt") as keyof PoolCreatedFilter;
            paginatedOptions.where = { ...options.where };
        }
        let results: Pick<PoolCreatedResult, K>[] = [];
        do {
            if (paginationKey && paginationValue)
                paginatedOptions.where![paginationKey] = paginationValue as any;
            const res = await axios.post(url, {
                query: generateGql("poolCreateds", paginatedOptions, args)
            });
            const r = res.data as any;
            if (r.errors && r.errors.length) {
                throw new Error(r.errors[0].message);
            }
            const rawResults = r.data[Object.keys(r.data)[0]] as any[];
            const newResults = rawResults.map((obj) => {
                const formattedObj: any = {};
                if (obj["id"])
                    formattedObj["id"] = obj["id"];
                if (obj["name"])
                    formattedObj["name"] = obj["name"];
                if (obj["symbol"])
                    formattedObj["symbol"] = obj["symbol"];
                if (obj["purchaseTokenCap"])
                    formattedObj["purchaseTokenCap"] = wei(obj["purchaseTokenCap"], 0);
                if (obj["purchaseToken"])
                    formattedObj["purchaseToken"] = obj["purchaseToken"];
                if (obj["purchaseTokenSymbol"])
                    formattedObj["purchaseTokenSymbol"] = obj["purchaseTokenSymbol"];
                if (obj["duration"])
                    formattedObj["duration"] = wei(obj["duration"], 0);
                if (obj["sponsorFee"])
                    formattedObj["sponsorFee"] = wei(obj["sponsorFee"], 0);
                if (obj["sponsor"])
                    formattedObj["sponsor"] = obj["sponsor"];
                if (obj["purchaseDuration"])
                    formattedObj["purchaseDuration"] = wei(obj["purchaseDuration"], 0);
                if (obj["purchaseExpiry"])
                    formattedObj["purchaseExpiry"] = wei(obj["purchaseExpiry"], 0);
                if (obj["purchaseTokenDecimals"])
                    formattedObj["purchaseTokenDecimals"] = obj["purchaseTokenDecimals"];
                if (obj["timestamp"])
                    formattedObj["timestamp"] = wei(obj["timestamp"], 0);
                if (obj["hasAllowList"])
                    formattedObj["hasAllowList"] = obj["hasAllowList"];
                if (obj["poolStatus"])
                    formattedObj["poolStatus"] = obj["poolStatus"];
                if (obj["contributions"])
                    formattedObj["contributions"] = wei(obj["contributions"], 0);
                if (obj["totalSupply"])
                    formattedObj["totalSupply"] = wei(obj["totalSupply"], 0);
                if (obj["dealAddress"])
                    formattedObj["dealAddress"] = obj["dealAddress"];
                return formattedObj as Pick<PoolCreatedResult, K>;
            });
            results = results.concat(newResults);
            if (newResults.length < 1000) {
                break;
            }
            if (paginationKey) {
                paginationValue = rawResults[rawResults.length - 1][paginatedOptions.orderBy!];
            }
        } while (paginationKey && (options.first && results.length < options.first));
        return options.first ? results.slice(0, options.first) : results;
    };
    const enabled = options && args;
    return useQuery(["codegen-graphql", enabled ? generateGql("PoolCreateds", options, args) : null, networkId], async () => func(url, options!, args!), {
        ...queryOptions,
        enabled: !!options && !!args,
    });
};
export type PurchasePoolTokenFilter = {
    id?: string | null;
    id_not?: string | null;
    id_gt?: string | null;
    id_lt?: string | null;
    id_gte?: string | null;
    id_lte?: string | null;
    id_in?: string[];
    id_not_in?: string[];
    purchaser?: string | null;
    purchaser_not?: string | null;
    purchaser_in?: string[];
    purchaser_not_in?: string[];
    purchaser_contains?: string | null;
    purchaser_not_contains?: string | null;
    poolAddress?: string | null;
    poolAddress_not?: string | null;
    poolAddress_in?: string[];
    poolAddress_not_in?: string[];
    poolAddress_contains?: string | null;
    poolAddress_not_contains?: string | null;
    purchaseTokenAmount?: WeiSource | null;
    purchaseTokenAmount_not?: WeiSource | null;
    purchaseTokenAmount_gt?: WeiSource | null;
    purchaseTokenAmount_lt?: WeiSource | null;
    purchaseTokenAmount_gte?: WeiSource | null;
    purchaseTokenAmount_lte?: WeiSource | null;
    purchaseTokenAmount_in?: WeiSource[];
    purchaseTokenAmount_not_in?: WeiSource[];
    timestamp?: WeiSource | null;
    timestamp_not?: WeiSource | null;
    timestamp_gt?: WeiSource | null;
    timestamp_lt?: WeiSource | null;
    timestamp_gte?: WeiSource | null;
    timestamp_lte?: WeiSource | null;
    timestamp_in?: WeiSource[];
    timestamp_not_in?: WeiSource[];
};
export type PurchasePoolTokenResult = {
    id: string;
    purchaser: string;
    poolAddress: string;
    purchaseTokenAmount: Wei;
    timestamp: Wei;
};
export type PurchasePoolTokenFields = {
    id: true;
    purchaser: true;
    poolAddress: true;
    purchaseTokenAmount: true;
    timestamp: true;
};
export type PurchasePoolTokenArgs<K extends keyof PurchasePoolTokenResult> = {
    [Property in keyof Pick<PurchasePoolTokenFields, K>]: PurchasePoolTokenFields[Property];
};
export const useGetPurchasePoolTokenById = <K extends keyof PurchasePoolTokenResult>(url: string, options?: SingleQueryOptions, args?: PurchasePoolTokenArgs<K>, queryOptions: UseQueryOptions<Pick<PurchasePoolTokenResult, K>> = {}) => {
    const func = async function <K extends keyof PurchasePoolTokenResult>(url: string, options: SingleQueryOptions, args: PurchasePoolTokenArgs<K>): Promise<Pick<PurchasePoolTokenResult, K>> {
        const res = await axios.post(url, {
            query: generateGql("purchasePoolToken", options, args)
        });
        const r = res.data as any;
        if (r.errors && r.errors.length) {
            throw new Error(r.errors[0].message);
        }
        const obj = (r.data[Object.keys(r.data)[0]] as any);
        const formattedObj: any = {};
        if (obj["id"])
            formattedObj["id"] = obj["id"];
        if (obj["purchaser"])
            formattedObj["purchaser"] = obj["purchaser"];
        if (obj["poolAddress"])
            formattedObj["poolAddress"] = obj["poolAddress"];
        if (obj["purchaseTokenAmount"])
            formattedObj["purchaseTokenAmount"] = wei(obj["purchaseTokenAmount"], 0);
        if (obj["timestamp"])
            formattedObj["timestamp"] = wei(obj["timestamp"], 0);
        return formattedObj as Pick<PurchasePoolTokenResult, K>;
    };
    const enabled = options && args;
    return useQuery(["codegen-graphql", enabled ? generateGql("PurchasePoolToken", options, args) : null], async () => func(url, options!, args!), {
        ...queryOptions,
        enabled: !!options && !!args,
    });
};
export const useGetPurchasePoolTokens = <K extends keyof PurchasePoolTokenResult>(url: string, options?: MultiQueryOptions<PurchasePoolTokenFilter, PurchasePoolTokenResult>, args?: PurchasePoolTokenArgs<K>, queryOptions: UseQueryOptions<Pick<PurchasePoolTokenResult, K>[]> = {}, networkId: NetworkId) => {
    const func = async function <K extends keyof PurchasePoolTokenResult>(url: string, options: MultiQueryOptions<PurchasePoolTokenFilter, PurchasePoolTokenResult>, args: PurchasePoolTokenArgs<K>): Promise<Pick<PurchasePoolTokenResult, K>[]> {
        const paginatedOptions: Partial<MultiQueryOptions<PurchasePoolTokenFilter, PurchasePoolTokenResult>> = { ...options };
        let paginationKey: keyof PurchasePoolTokenFilter | null = null;
        let paginationValue = "";
        if (options.first && options.first > MAX_PAGE) {
            paginatedOptions.first = MAX_PAGE;
            paginatedOptions.orderBy = options.orderBy || "id";
            paginatedOptions.orderDirection = options.orderDirection || "asc";
            paginationKey = paginatedOptions.orderBy + (paginatedOptions.orderDirection === "asc" ? "_gt" : "_lt") as keyof PurchasePoolTokenFilter;
            paginatedOptions.where = { ...options.where };
        }
        let results: Pick<PurchasePoolTokenResult, K>[] = [];
        do {
            if (paginationKey && paginationValue)
                paginatedOptions.where![paginationKey] = paginationValue as any;
            const res = await axios.post(url, {
                query: generateGql("purchasePoolTokens", paginatedOptions, args)
            });
            const r = res.data as any;
            if (r.errors && r.errors.length) {
                throw new Error(r.errors[0].message);
            }
            const rawResults = r.data[Object.keys(r.data)[0]] as any[];
            const newResults = rawResults.map((obj) => {
                const formattedObj: any = {};
                if (obj["id"])
                    formattedObj["id"] = obj["id"];
                if (obj["purchaser"])
                    formattedObj["purchaser"] = obj["purchaser"];
                if (obj["poolAddress"])
                    formattedObj["poolAddress"] = obj["poolAddress"];
                if (obj["purchaseTokenAmount"])
                    formattedObj["purchaseTokenAmount"] = wei(obj["purchaseTokenAmount"], 0);
                if (obj["timestamp"])
                    formattedObj["timestamp"] = wei(obj["timestamp"], 0);
                return formattedObj as Pick<PurchasePoolTokenResult, K>;
            });
            results = results.concat(newResults);
            if (newResults.length < 1000) {
                break;
            }
            if (paginationKey) {
                paginationValue = rawResults[rawResults.length - 1][paginatedOptions.orderBy!];
            }
        } while (paginationKey && (options.first && results.length < options.first));
        return options.first ? results.slice(0, options.first) : results;
    };
    const enabled = options && args;
    return useQuery(["codegen-graphql", enabled ? generateGql("PurchasePoolTokens", options, args) : null, networkId    ], async () => func(url, options!, args!), {
        ...queryOptions,
        enabled: !!options && !!args,
    });
};
export type SetHolderFilter = {
    id?: string | null;
    id_not?: string | null;
    id_gt?: string | null;
    id_lt?: string | null;
    id_gte?: string | null;
    id_lte?: string | null;
    id_in?: string[];
    id_not_in?: string[];
    holder?: string | null;
    holder_not?: string | null;
    holder_in?: string[];
    holder_not_in?: string[];
    holder_contains?: string | null;
    holder_not_contains?: string | null;
};
export type SetHolderResult = {
    id: string;
    holder: string;
};
export type SetHolderFields = {
    id: true;
    holder: true;
};
export type SetHolderArgs<K extends keyof SetHolderResult> = {
    [Property in keyof Pick<SetHolderFields, K>]: SetHolderFields[Property];
};
export const useGetSetHolderById = <K extends keyof SetHolderResult>(url: string, options?: SingleQueryOptions, args?: SetHolderArgs<K>, queryOptions: UseQueryOptions<Pick<SetHolderResult, K>> = {}) => {
    const func = async function <K extends keyof SetHolderResult>(url: string, options: SingleQueryOptions, args: SetHolderArgs<K>): Promise<Pick<SetHolderResult, K>> {
        const res = await axios.post(url, {
            query: generateGql("setHolder", options, args)
        });
        const r = res.data as any;
        if (r.errors && r.errors.length) {
            throw new Error(r.errors[0].message);
        }
        const obj = (r.data[Object.keys(r.data)[0]] as any);
        const formattedObj: any = {};
        if (obj["id"])
            formattedObj["id"] = obj["id"];
        if (obj["holder"])
            formattedObj["holder"] = obj["holder"];
        return formattedObj as Pick<SetHolderResult, K>;
    };
    const enabled = options && args;
    return useQuery(["codegen-graphql", enabled ? generateGql("SetHolder", options, args) : null], async () => func(url, options!, args!), {
        ...queryOptions,
        enabled: !!options && !!args,
    });
};
export const useGetSetHolders = <K extends keyof SetHolderResult>(url: string, options?: MultiQueryOptions<SetHolderFilter, SetHolderResult>, args?: SetHolderArgs<K>, queryOptions: UseQueryOptions<Pick<SetHolderResult, K>[]> = {}) => {
    const func = async function <K extends keyof SetHolderResult>(url: string, options: MultiQueryOptions<SetHolderFilter, SetHolderResult>, args: SetHolderArgs<K>): Promise<Pick<SetHolderResult, K>[]> {
        const paginatedOptions: Partial<MultiQueryOptions<SetHolderFilter, SetHolderResult>> = { ...options };
        let paginationKey: keyof SetHolderFilter | null = null;
        let paginationValue = "";
        if (options.first && options.first > MAX_PAGE) {
            paginatedOptions.first = MAX_PAGE;
            paginatedOptions.orderBy = options.orderBy || "id";
            paginatedOptions.orderDirection = options.orderDirection || "asc";
            paginationKey = paginatedOptions.orderBy + (paginatedOptions.orderDirection === "asc" ? "_gt" : "_lt") as keyof SetHolderFilter;
            paginatedOptions.where = { ...options.where };
        }
        let results: Pick<SetHolderResult, K>[] = [];
        do {
            if (paginationKey && paginationValue)
                paginatedOptions.where![paginationKey] = paginationValue as any;
            const res = await axios.post(url, {
                query: generateGql("setHolders", paginatedOptions, args)
            });
            const r = res.data as any;
            if (r.errors && r.errors.length) {
                throw new Error(r.errors[0].message);
            }
            const rawResults = r.data[Object.keys(r.data)[0]] as any[];
            const newResults = rawResults.map((obj) => {
                const formattedObj: any = {};
                if (obj["id"])
                    formattedObj["id"] = obj["id"];
                if (obj["holder"])
                    formattedObj["holder"] = obj["holder"];
                return formattedObj as Pick<SetHolderResult, K>;
            });
            results = results.concat(newResults);
            if (newResults.length < 1000) {
                break;
            }
            if (paginationKey) {
                paginationValue = rawResults[rawResults.length - 1][paginatedOptions.orderBy!];
            }
        } while (paginationKey && (options.first && results.length < options.first));
        return options.first ? results.slice(0, options.first) : results;
    };
    const enabled = options && args;
    return useQuery(["codegen-graphql", enabled ? generateGql("SetHolders", options, args) : null], async () => func(url, options!, args!), {
        ...queryOptions,
        enabled: !!options && !!args,
    });
};
export type SetSponsorFilter = {
    id?: string | null;
    id_not?: string | null;
    id_gt?: string | null;
    id_lt?: string | null;
    id_gte?: string | null;
    id_lte?: string | null;
    id_in?: string[];
    id_not_in?: string[];
    sponsor?: string | null;
    sponsor_not?: string | null;
    sponsor_in?: string[];
    sponsor_not_in?: string[];
    sponsor_contains?: string | null;
    sponsor_not_contains?: string | null;
};
export type SetSponsorResult = {
    id: string;
    sponsor: string;
};
export type SetSponsorFields = {
    id: true;
    sponsor: true;
};
export type SetSponsorArgs<K extends keyof SetSponsorResult> = {
    [Property in keyof Pick<SetSponsorFields, K>]: SetSponsorFields[Property];
};
export const useGetSetSponsorById = <K extends keyof SetSponsorResult>(url: string, options?: SingleQueryOptions, args?: SetSponsorArgs<K>, queryOptions: UseQueryOptions<Pick<SetSponsorResult, K>> = {}) => {
    const func = async function <K extends keyof SetSponsorResult>(url: string, options: SingleQueryOptions, args: SetSponsorArgs<K>): Promise<Pick<SetSponsorResult, K>> {
        const res = await axios.post(url, {
            query: generateGql("setSponsor", options, args)
        });
        const r = res.data as any;
        if (r.errors && r.errors.length) {
            throw new Error(r.errors[0].message);
        }
        const obj = (r.data[Object.keys(r.data)[0]] as any);
        const formattedObj: any = {};
        if (obj["id"])
            formattedObj["id"] = obj["id"];
        if (obj["sponsor"])
            formattedObj["sponsor"] = obj["sponsor"];
        return formattedObj as Pick<SetSponsorResult, K>;
    };
    const enabled = options && args;
    return useQuery(["codegen-graphql", enabled ? generateGql("SetSponsor", options, args) : null], async () => func(url, options!, args!), {
        ...queryOptions,
        enabled: !!options && !!args,
    });
};
export const useGetSetSponsors = <K extends keyof SetSponsorResult>(url: string, options?: MultiQueryOptions<SetSponsorFilter, SetSponsorResult>, args?: SetSponsorArgs<K>, queryOptions: UseQueryOptions<Pick<SetSponsorResult, K>[]> = {}) => {
    const func = async function <K extends keyof SetSponsorResult>(url: string, options: MultiQueryOptions<SetSponsorFilter, SetSponsorResult>, args: SetSponsorArgs<K>): Promise<Pick<SetSponsorResult, K>[]> {
        const paginatedOptions: Partial<MultiQueryOptions<SetSponsorFilter, SetSponsorResult>> = { ...options };
        let paginationKey: keyof SetSponsorFilter | null = null;
        let paginationValue = "";
        if (options.first && options.first > MAX_PAGE) {
            paginatedOptions.first = MAX_PAGE;
            paginatedOptions.orderBy = options.orderBy || "id";
            paginatedOptions.orderDirection = options.orderDirection || "asc";
            paginationKey = paginatedOptions.orderBy + (paginatedOptions.orderDirection === "asc" ? "_gt" : "_lt") as keyof SetSponsorFilter;
            paginatedOptions.where = { ...options.where };
        }
        let results: Pick<SetSponsorResult, K>[] = [];
        do {
            if (paginationKey && paginationValue)
                paginatedOptions.where![paginationKey] = paginationValue as any;
            const res = await axios.post(url, {
                query: generateGql("setSponsors", paginatedOptions, args)
            });
            const r = res.data as any;
            if (r.errors && r.errors.length) {
                throw new Error(r.errors[0].message);
            }
            const rawResults = r.data[Object.keys(r.data)[0]] as any[];
            const newResults = rawResults.map((obj) => {
                const formattedObj: any = {};
                if (obj["id"])
                    formattedObj["id"] = obj["id"];
                if (obj["sponsor"])
                    formattedObj["sponsor"] = obj["sponsor"];
                return formattedObj as Pick<SetSponsorResult, K>;
            });
            results = results.concat(newResults);
            if (newResults.length < 1000) {
                break;
            }
            if (paginationKey) {
                paginationValue = rawResults[rawResults.length - 1][paginatedOptions.orderBy!];
            }
        } while (paginationKey && (options.first && results.length < options.first));
        return options.first ? results.slice(0, options.first) : results;
    };
    const enabled = options && args;
    return useQuery(["codegen-graphql", enabled ? generateGql("SetSponsors", options, args) : null], async () => func(url, options!, args!), {
        ...queryOptions,
        enabled: !!options && !!args,
    });
};
export type TotalPoolsCreatedFilter = {
    id?: string | null;
    id_not?: string | null;
    id_gt?: string | null;
    id_lt?: string | null;
    id_gte?: string | null;
    id_lte?: string | null;
    id_in?: string[];
    id_not_in?: string[];
    count?: WeiSource | null;
    count_not?: WeiSource | null;
    count_gt?: WeiSource | null;
    count_lt?: WeiSource | null;
    count_gte?: WeiSource | null;
    count_lte?: WeiSource | null;
    count_in?: WeiSource[];
    count_not_in?: WeiSource[];
};
export type TotalPoolsCreatedResult = {
    id: string;
    count: Wei;
};
export type TotalPoolsCreatedFields = {
    id: true;
    count: true;
};
export type TotalPoolsCreatedArgs<K extends keyof TotalPoolsCreatedResult> = {
    [Property in keyof Pick<TotalPoolsCreatedFields, K>]: TotalPoolsCreatedFields[Property];
};
export const useGetTotalPoolsCreatedById = <K extends keyof TotalPoolsCreatedResult>(url: string, options?: SingleQueryOptions, args?: TotalPoolsCreatedArgs<K>, queryOptions: UseQueryOptions<Pick<TotalPoolsCreatedResult, K>> = {}) => {
    const func = async function <K extends keyof TotalPoolsCreatedResult>(url: string, options: SingleQueryOptions, args: TotalPoolsCreatedArgs<K>): Promise<Pick<TotalPoolsCreatedResult, K>> {
        const res = await axios.post(url, {
            query: generateGql("totalPoolsCreated", options, args)
        });
        const r = res.data as any;
        if (r.errors && r.errors.length) {
            throw new Error(r.errors[0].message);
        }
        const obj = (r.data[Object.keys(r.data)[0]] as any);
        const formattedObj: any = {};
        if (obj["id"])
            formattedObj["id"] = obj["id"];
        if (obj["count"])
            formattedObj["count"] = wei(obj["count"], 0);
        return formattedObj as Pick<TotalPoolsCreatedResult, K>;
    };
    const enabled = options && args;
    return useQuery(["codegen-graphql", enabled ? generateGql("TotalPoolsCreated", options, args) : null], async () => func(url, options!, args!), {
        ...queryOptions,
        enabled: !!options && !!args,
    });
};
export const useGetTotalPoolsCreateds = <K extends keyof TotalPoolsCreatedResult>(url: string, options?: MultiQueryOptions<TotalPoolsCreatedFilter, TotalPoolsCreatedResult>, args?: TotalPoolsCreatedArgs<K>, queryOptions: UseQueryOptions<Pick<TotalPoolsCreatedResult, K>[]> = {}) => {
    const func = async function <K extends keyof TotalPoolsCreatedResult>(url: string, options: MultiQueryOptions<TotalPoolsCreatedFilter, TotalPoolsCreatedResult>, args: TotalPoolsCreatedArgs<K>): Promise<Pick<TotalPoolsCreatedResult, K>[]> {
        const paginatedOptions: Partial<MultiQueryOptions<TotalPoolsCreatedFilter, TotalPoolsCreatedResult>> = { ...options };
        let paginationKey: keyof TotalPoolsCreatedFilter | null = null;
        let paginationValue = "";
        if (options.first && options.first > MAX_PAGE) {
            paginatedOptions.first = MAX_PAGE;
            paginatedOptions.orderBy = options.orderBy || "id";
            paginatedOptions.orderDirection = options.orderDirection || "asc";
            paginationKey = paginatedOptions.orderBy + (paginatedOptions.orderDirection === "asc" ? "_gt" : "_lt") as keyof TotalPoolsCreatedFilter;
            paginatedOptions.where = { ...options.where };
        }
        let results: Pick<TotalPoolsCreatedResult, K>[] = [];
        do {
            if (paginationKey && paginationValue)
                paginatedOptions.where![paginationKey] = paginationValue as any;
            const res = await axios.post(url, {
                query: generateGql("totalPoolsCreateds", paginatedOptions, args)
            });
            const r = res.data as any;
            if (r.errors && r.errors.length) {
                throw new Error(r.errors[0].message);
            }
            const rawResults = r.data[Object.keys(r.data)[0]] as any[];
            const newResults = rawResults.map((obj) => {
                const formattedObj: any = {};
                if (obj["id"])
                    formattedObj["id"] = obj["id"];
                if (obj["count"])
                    formattedObj["count"] = wei(obj["count"], 0);
                return formattedObj as Pick<TotalPoolsCreatedResult, K>;
            });
            results = results.concat(newResults);
            if (newResults.length < 1000) {
                break;
            }
            if (paginationKey) {
                paginationValue = rawResults[rawResults.length - 1][paginatedOptions.orderBy!];
            }
        } while (paginationKey && (options.first && results.length < options.first));
        return options.first ? results.slice(0, options.first) : results;
    };
    const enabled = options && args;
    return useQuery(["codegen-graphql", enabled ? generateGql("TotalPoolsCreateds", options, args) : null], async () => func(url, options!, args!), {
        ...queryOptions,
        enabled: !!options && !!args,
    });
};
export type TransferFilter = {
    id?: string | null;
    id_not?: string | null;
    id_gt?: string | null;
    id_lt?: string | null;
    id_gte?: string | null;
    id_lte?: string | null;
    id_in?: string[];
    id_not_in?: string[];
    from?: string | null;
    from_not?: string | null;
    from_in?: string[];
    from_not_in?: string[];
    from_contains?: string | null;
    from_not_contains?: string | null;
    to?: string | null;
    to_not?: string | null;
    to_in?: string[];
    to_not_in?: string[];
    to_contains?: string | null;
    to_not_contains?: string | null;
    value?: WeiSource | null;
    value_not?: WeiSource | null;
    value_gt?: WeiSource | null;
    value_lt?: WeiSource | null;
    value_gte?: WeiSource | null;
    value_lte?: WeiSource | null;
    value_in?: WeiSource[];
    value_not_in?: WeiSource[];
};
export type TransferResult = {
    id: string;
    from: string;
    to: string;
    value: Wei;
};
export type TransferFields = {
    id: true;
    from: true;
    to: true;
    value: true;
};
export type TransferArgs<K extends keyof TransferResult> = {
    [Property in keyof Pick<TransferFields, K>]: TransferFields[Property];
};
export const useGetTransferById = <K extends keyof TransferResult>(url: string, options?: SingleQueryOptions, args?: TransferArgs<K>, queryOptions: UseQueryOptions<Pick<TransferResult, K>> = {}) => {
    const func = async function <K extends keyof TransferResult>(url: string, options: SingleQueryOptions, args: TransferArgs<K>): Promise<Pick<TransferResult, K>> {
        const res = await axios.post(url, {
            query: generateGql("transfer", options, args)
        });
        const r = res.data as any;
        if (r.errors && r.errors.length) {
            throw new Error(r.errors[0].message);
        }
        const obj = (r.data[Object.keys(r.data)[0]] as any);
        const formattedObj: any = {};
        if (obj["id"])
            formattedObj["id"] = obj["id"];
        if (obj["from"])
            formattedObj["from"] = obj["from"];
        if (obj["to"])
            formattedObj["to"] = obj["to"];
        if (obj["value"])
            formattedObj["value"] = wei(obj["value"], 0);
        return formattedObj as Pick<TransferResult, K>;
    };
    const enabled = options && args;
    return useQuery(["codegen-graphql", enabled ? generateGql("Transfer", options, args) : null], async () => func(url, options!, args!), {
        ...queryOptions,
        enabled: !!options && !!args,
    });
};
export const useGetTransfers = <K extends keyof TransferResult>(url: string, options?: MultiQueryOptions<TransferFilter, TransferResult>, args?: TransferArgs<K>, queryOptions: UseQueryOptions<Pick<TransferResult, K>[]> = {}) => {
    const func = async function <K extends keyof TransferResult>(url: string, options: MultiQueryOptions<TransferFilter, TransferResult>, args: TransferArgs<K>): Promise<Pick<TransferResult, K>[]> {
        const paginatedOptions: Partial<MultiQueryOptions<TransferFilter, TransferResult>> = { ...options };
        let paginationKey: keyof TransferFilter | null = null;
        let paginationValue = "";
        if (options.first && options.first > MAX_PAGE) {
            paginatedOptions.first = MAX_PAGE;
            paginatedOptions.orderBy = options.orderBy || "id";
            paginatedOptions.orderDirection = options.orderDirection || "asc";
            paginationKey = paginatedOptions.orderBy + (paginatedOptions.orderDirection === "asc" ? "_gt" : "_lt") as keyof TransferFilter;
            paginatedOptions.where = { ...options.where };
        }
        let results: Pick<TransferResult, K>[] = [];
        do {
            if (paginationKey && paginationValue)
                paginatedOptions.where![paginationKey] = paginationValue as any;
            const res = await axios.post(url, {
                query: generateGql("transfers", paginatedOptions, args)
            });
            const r = res.data as any;
            if (r.errors && r.errors.length) {
                throw new Error(r.errors[0].message);
            }
            const rawResults = r.data[Object.keys(r.data)[0]] as any[];
            const newResults = rawResults.map((obj) => {
                const formattedObj: any = {};
                if (obj["id"])
                    formattedObj["id"] = obj["id"];
                if (obj["from"])
                    formattedObj["from"] = obj["from"];
                if (obj["to"])
                    formattedObj["to"] = obj["to"];
                if (obj["value"])
                    formattedObj["value"] = wei(obj["value"], 0);
                return formattedObj as Pick<TransferResult, K>;
            });
            results = results.concat(newResults);
            if (newResults.length < 1000) {
                break;
            }
            if (paginationKey) {
                paginationValue = rawResults[rawResults.length - 1][paginatedOptions.orderBy!];
            }
        } while (paginationKey && (options.first && results.length < options.first));
        return options.first ? results.slice(0, options.first) : results;
    };
    const enabled = options && args;
    return useQuery(["codegen-graphql", enabled ? generateGql("Transfers", options, args) : null], async () => func(url, options!, args!), {
        ...queryOptions,
        enabled: !!options && !!args,
    });
};
export type WithdrawFromPoolFilter = {
    id?: string | null;
    id_not?: string | null;
    id_gt?: string | null;
    id_lt?: string | null;
    id_gte?: string | null;
    id_lte?: string | null;
    id_in?: string[];
    id_not_in?: string[];
    purchaser?: string | null;
    purchaser_not?: string | null;
    purchaser_in?: string[];
    purchaser_not_in?: string[];
    purchaser_contains?: string | null;
    purchaser_not_contains?: string | null;
    poolAddress?: string | null;
    poolAddress_not?: string | null;
    poolAddress_in?: string[];
    poolAddress_not_in?: string[];
    poolAddress_contains?: string | null;
    poolAddress_not_contains?: string | null;
    purchaseTokenAmount?: WeiSource | null;
    purchaseTokenAmount_not?: WeiSource | null;
    purchaseTokenAmount_gt?: WeiSource | null;
    purchaseTokenAmount_lt?: WeiSource | null;
    purchaseTokenAmount_gte?: WeiSource | null;
    purchaseTokenAmount_lte?: WeiSource | null;
    purchaseTokenAmount_in?: WeiSource[];
    purchaseTokenAmount_not_in?: WeiSource[];
};
export type WithdrawFromPoolResult = {
    id: string;
    purchaser: string;
    poolAddress: string;
    purchaseTokenAmount: Wei;
};
export type WithdrawFromPoolFields = {
    id: true;
    purchaser: true;
    poolAddress: true;
    purchaseTokenAmount: true;
};
export type WithdrawFromPoolArgs<K extends keyof WithdrawFromPoolResult> = {
    [Property in keyof Pick<WithdrawFromPoolFields, K>]: WithdrawFromPoolFields[Property];
};
export const useGetWithdrawFromPoolById = <K extends keyof WithdrawFromPoolResult>(url: string, options?: SingleQueryOptions, args?: WithdrawFromPoolArgs<K>, queryOptions: UseQueryOptions<Pick<WithdrawFromPoolResult, K>> = {}) => {
    const func = async function <K extends keyof WithdrawFromPoolResult>(url: string, options: SingleQueryOptions, args: WithdrawFromPoolArgs<K>): Promise<Pick<WithdrawFromPoolResult, K>> {
        const res = await axios.post(url, {
            query: generateGql("withdrawFromPool", options, args)
        });
        const r = res.data as any;
        if (r.errors && r.errors.length) {
            throw new Error(r.errors[0].message);
        }
        const obj = (r.data[Object.keys(r.data)[0]] as any);
        const formattedObj: any = {};
        if (obj["id"])
            formattedObj["id"] = obj["id"];
        if (obj["purchaser"])
            formattedObj["purchaser"] = obj["purchaser"];
        if (obj["poolAddress"])
            formattedObj["poolAddress"] = obj["poolAddress"];
        if (obj["purchaseTokenAmount"])
            formattedObj["purchaseTokenAmount"] = wei(obj["purchaseTokenAmount"], 0);
        return formattedObj as Pick<WithdrawFromPoolResult, K>;
    };
    const enabled = options && args;
    return useQuery(["codegen-graphql", enabled ? generateGql("WithdrawFromPool", options, args) : null], async () => func(url, options!, args!), {
        ...queryOptions,
        enabled: !!options && !!args,
    });
};
export const useGetWithdrawFromPools = <K extends keyof WithdrawFromPoolResult>(url: string, options?: MultiQueryOptions<WithdrawFromPoolFilter, WithdrawFromPoolResult>, args?: WithdrawFromPoolArgs<K>, queryOptions: UseQueryOptions<Pick<WithdrawFromPoolResult, K>[]> = {}) => {
    const func = async function <K extends keyof WithdrawFromPoolResult>(url: string, options: MultiQueryOptions<WithdrawFromPoolFilter, WithdrawFromPoolResult>, args: WithdrawFromPoolArgs<K>): Promise<Pick<WithdrawFromPoolResult, K>[]> {
        const paginatedOptions: Partial<MultiQueryOptions<WithdrawFromPoolFilter, WithdrawFromPoolResult>> = { ...options };
        let paginationKey: keyof WithdrawFromPoolFilter | null = null;
        let paginationValue = "";
        if (options.first && options.first > MAX_PAGE) {
            paginatedOptions.first = MAX_PAGE;
            paginatedOptions.orderBy = options.orderBy || "id";
            paginatedOptions.orderDirection = options.orderDirection || "asc";
            paginationKey = paginatedOptions.orderBy + (paginatedOptions.orderDirection === "asc" ? "_gt" : "_lt") as keyof WithdrawFromPoolFilter;
            paginatedOptions.where = { ...options.where };
        }
        let results: Pick<WithdrawFromPoolResult, K>[] = [];
        do {
            if (paginationKey && paginationValue)
                paginatedOptions.where![paginationKey] = paginationValue as any;
            const res = await axios.post(url, {
                query: generateGql("withdrawFromPools", paginatedOptions, args)
            });
            const r = res.data as any;
            if (r.errors && r.errors.length) {
                throw new Error(r.errors[0].message);
            }
            const rawResults = r.data[Object.keys(r.data)[0]] as any[];
            const newResults = rawResults.map((obj) => {
                const formattedObj: any = {};
                if (obj["id"])
                    formattedObj["id"] = obj["id"];
                if (obj["purchaser"])
                    formattedObj["purchaser"] = obj["purchaser"];
                if (obj["poolAddress"])
                    formattedObj["poolAddress"] = obj["poolAddress"];
                if (obj["purchaseTokenAmount"])
                    formattedObj["purchaseTokenAmount"] = wei(obj["purchaseTokenAmount"], 0);
                return formattedObj as Pick<WithdrawFromPoolResult, K>;
            });
            results = results.concat(newResults);
            if (newResults.length < 1000) {
                break;
            }
            if (paginationKey) {
                paginationValue = rawResults[rawResults.length - 1][paginatedOptions.orderBy!];
            }
        } while (paginationKey && (options.first && results.length < options.first));
        return options.first ? results.slice(0, options.first) : results;
    };
    const enabled = options && args;
    return useQuery(["codegen-graphql", enabled ? generateGql("WithdrawFromPools", options, args) : null], async () => func(url, options!, args!), {
        ...queryOptions,
        enabled: !!options && !!args,
    });
};
export type WithdrawUnderlyingDealTokenFilter = {
    id?: string | null;
    id_not?: string | null;
    id_gt?: string | null;
    id_lt?: string | null;
    id_gte?: string | null;
    id_lte?: string | null;
    id_in?: string[];
    id_not_in?: string[];
    underlyingDealTokenAddress?: string | null;
    underlyingDealTokenAddress_not?: string | null;
    underlyingDealTokenAddress_in?: string[];
    underlyingDealTokenAddress_not_in?: string[];
    underlyingDealTokenAddress_contains?: string | null;
    underlyingDealTokenAddress_not_contains?: string | null;
    depositor?: string | null;
    depositor_not?: string | null;
    depositor_in?: string[];
    depositor_not_in?: string[];
    depositor_contains?: string | null;
    depositor_not_contains?: string | null;
    dealContract?: string | null;
    dealContract_not?: string | null;
    dealContract_in?: string[];
    dealContract_not_in?: string[];
    dealContract_contains?: string | null;
    dealContract_not_contains?: string | null;
    underlyingDealTokenAmount?: WeiSource | null;
    underlyingDealTokenAmount_not?: WeiSource | null;
    underlyingDealTokenAmount_gt?: WeiSource | null;
    underlyingDealTokenAmount_lt?: WeiSource | null;
    underlyingDealTokenAmount_gte?: WeiSource | null;
    underlyingDealTokenAmount_lte?: WeiSource | null;
    underlyingDealTokenAmount_in?: WeiSource[];
    underlyingDealTokenAmount_not_in?: WeiSource[];
};
export type WithdrawUnderlyingDealTokenResult = {
    id: string;
    underlyingDealTokenAddress: string;
    depositor: string;
    dealContract: string;
    underlyingDealTokenAmount: Wei;
};
export type WithdrawUnderlyingDealTokenFields = {
    id: true;
    underlyingDealTokenAddress: true;
    depositor: true;
    dealContract: true;
    underlyingDealTokenAmount: true;
};
export type WithdrawUnderlyingDealTokenArgs<K extends keyof WithdrawUnderlyingDealTokenResult> = {
    [Property in keyof Pick<WithdrawUnderlyingDealTokenFields, K>]: WithdrawUnderlyingDealTokenFields[Property];
};
export const useGetWithdrawUnderlyingDealTokenById = <K extends keyof WithdrawUnderlyingDealTokenResult>(url: string, options?: SingleQueryOptions, args?: WithdrawUnderlyingDealTokenArgs<K>, queryOptions: UseQueryOptions<Pick<WithdrawUnderlyingDealTokenResult, K>> = {}) => {
    const func = async function <K extends keyof WithdrawUnderlyingDealTokenResult>(url: string, options: SingleQueryOptions, args: WithdrawUnderlyingDealTokenArgs<K>): Promise<Pick<WithdrawUnderlyingDealTokenResult, K>> {
        const res = await axios.post(url, {
            query: generateGql("withdrawUnderlyingDealToken", options, args)
        });
        const r = res.data as any;
        if (r.errors && r.errors.length) {
            throw new Error(r.errors[0].message);
        }
        const obj = (r.data[Object.keys(r.data)[0]] as any);
        const formattedObj: any = {};
        if (obj["id"])
            formattedObj["id"] = obj["id"];
        if (obj["underlyingDealTokenAddress"])
            formattedObj["underlyingDealTokenAddress"] = obj["underlyingDealTokenAddress"];
        if (obj["depositor"])
            formattedObj["depositor"] = obj["depositor"];
        if (obj["dealContract"])
            formattedObj["dealContract"] = obj["dealContract"];
        if (obj["underlyingDealTokenAmount"])
            formattedObj["underlyingDealTokenAmount"] = wei(obj["underlyingDealTokenAmount"], 0);
        return formattedObj as Pick<WithdrawUnderlyingDealTokenResult, K>;
    };
    const enabled = options && args;
    return useQuery(["codegen-graphql", enabled ? generateGql("WithdrawUnderlyingDealToken", options, args) : null], async () => func(url, options!, args!), {
        ...queryOptions,
        enabled: !!options && !!args,
    });
};
export const useGetWithdrawUnderlyingDealTokens = <K extends keyof WithdrawUnderlyingDealTokenResult>(url: string, options?: MultiQueryOptions<WithdrawUnderlyingDealTokenFilter, WithdrawUnderlyingDealTokenResult>, args?: WithdrawUnderlyingDealTokenArgs<K>, queryOptions: UseQueryOptions<Pick<WithdrawUnderlyingDealTokenResult, K>[]> = {}) => {
    const func = async function <K extends keyof WithdrawUnderlyingDealTokenResult>(url: string, options: MultiQueryOptions<WithdrawUnderlyingDealTokenFilter, WithdrawUnderlyingDealTokenResult>, args: WithdrawUnderlyingDealTokenArgs<K>): Promise<Pick<WithdrawUnderlyingDealTokenResult, K>[]> {
        const paginatedOptions: Partial<MultiQueryOptions<WithdrawUnderlyingDealTokenFilter, WithdrawUnderlyingDealTokenResult>> = { ...options };
        let paginationKey: keyof WithdrawUnderlyingDealTokenFilter | null = null;
        let paginationValue = "";
        if (options.first && options.first > MAX_PAGE) {
            paginatedOptions.first = MAX_PAGE;
            paginatedOptions.orderBy = options.orderBy || "id";
            paginatedOptions.orderDirection = options.orderDirection || "asc";
            paginationKey = paginatedOptions.orderBy + (paginatedOptions.orderDirection === "asc" ? "_gt" : "_lt") as keyof WithdrawUnderlyingDealTokenFilter;
            paginatedOptions.where = { ...options.where };
        }
        let results: Pick<WithdrawUnderlyingDealTokenResult, K>[] = [];
        do {
            if (paginationKey && paginationValue)
                paginatedOptions.where![paginationKey] = paginationValue as any;
            const res = await axios.post(url, {
                query: generateGql("withdrawUnderlyingDealTokens", paginatedOptions, args)
            });
            const r = res.data as any;
            if (r.errors && r.errors.length) {
                throw new Error(r.errors[0].message);
            }
            const rawResults = r.data[Object.keys(r.data)[0]] as any[];
            const newResults = rawResults.map((obj) => {
                const formattedObj: any = {};
                if (obj["id"])
                    formattedObj["id"] = obj["id"];
                if (obj["underlyingDealTokenAddress"])
                    formattedObj["underlyingDealTokenAddress"] = obj["underlyingDealTokenAddress"];
                if (obj["depositor"])
                    formattedObj["depositor"] = obj["depositor"];
                if (obj["dealContract"])
                    formattedObj["dealContract"] = obj["dealContract"];
                if (obj["underlyingDealTokenAmount"])
                    formattedObj["underlyingDealTokenAmount"] = wei(obj["underlyingDealTokenAmount"], 0);
                return formattedObj as Pick<WithdrawUnderlyingDealTokenResult, K>;
            });
            results = results.concat(newResults);
            if (newResults.length < 1000) {
                break;
            }
            if (paginationKey) {
                paginationValue = rawResults[rawResults.length - 1][paginatedOptions.orderBy!];
            }
        } while (paginationKey && (options.first && results.length < options.first));
        return options.first ? results.slice(0, options.first) : results;
    };
    const enabled = options && args;
    return useQuery(["codegen-graphql", enabled ? generateGql("WithdrawUnderlyingDealTokens", options, args) : null], async () => func(url, options!, args!), {
        ...queryOptions,
        enabled: !!options && !!args,
    });
};
