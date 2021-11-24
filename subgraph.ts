import { useQuery, UseQueryOptions } from "react-query";
import Wei, { WeiSource, wei } from "@synthetixio/wei";
import axios from "codegen-graph-ts/build/src/lib/axios";
import generateGql from "codegen-graph-ts/build/src/lib/gql";
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
export type ClaimedUnderlyingDealTokensFilter = {
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
};
export type ClaimedUnderlyingDealTokensResult = {
    id: string;
    underlyingDealTokenAddress: string;
    recipient: string;
    underlyingDealTokensClaimed: Wei;
};
export type ClaimedUnderlyingDealTokensFields = {
    id: true;
    underlyingDealTokenAddress: true;
    recipient: true;
    underlyingDealTokensClaimed: true;
};
export type ClaimedUnderlyingDealTokensArgs<K extends keyof ClaimedUnderlyingDealTokensResult> = {
    [Property in keyof Pick<ClaimedUnderlyingDealTokensFields, K>]: ClaimedUnderlyingDealTokensFields[Property];
};
export const useGetClaimedUnderlyingDealTokensById = <K extends keyof ClaimedUnderlyingDealTokensResult>(url: string, options?: SingleQueryOptions, args?: ClaimedUnderlyingDealTokensArgs<K>, queryOptions: UseQueryOptions<Pick<ClaimedUnderlyingDealTokensResult, K>> = {}) => {
    const func = async function <K extends keyof ClaimedUnderlyingDealTokensResult>(url: string, options: SingleQueryOptions, args: ClaimedUnderlyingDealTokensArgs<K>): Promise<Pick<ClaimedUnderlyingDealTokensResult, K>> {
        const res = await axios.post(url, {
            query: generateGql("claimedUnderlyingDealTokens", options, args)
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
        return formattedObj as Pick<ClaimedUnderlyingDealTokensResult, K>;
    };
    const enabled = options && args;
    return useQuery(["codegen-graphql", enabled ? generateGql("ClaimedUnderlyingDealTokens", options, args) : null], async () => func(url, options!, args!), {
        ...queryOptions,
        enabled: !!options && !!args,
    });
};
export const useGetClaimedUnderlyingDealTokenss = <K extends keyof ClaimedUnderlyingDealTokensResult>(url: string, options?: MultiQueryOptions<ClaimedUnderlyingDealTokensFilter, ClaimedUnderlyingDealTokensResult>, args?: ClaimedUnderlyingDealTokensArgs<K>, queryOptions: UseQueryOptions<Pick<ClaimedUnderlyingDealTokensResult, K>[]> = {}) => {
    const func = async function <K extends keyof ClaimedUnderlyingDealTokensResult>(url: string, options: MultiQueryOptions<ClaimedUnderlyingDealTokensFilter, ClaimedUnderlyingDealTokensResult>, args: ClaimedUnderlyingDealTokensArgs<K>): Promise<Pick<ClaimedUnderlyingDealTokensResult, K>[]> {
        const paginatedOptions: Partial<MultiQueryOptions<ClaimedUnderlyingDealTokensFilter, ClaimedUnderlyingDealTokensResult>> = { ...options };
        let paginationKey: keyof ClaimedUnderlyingDealTokensFilter | null = null;
        let paginationValue = "";
        if (options.first && options.first > MAX_PAGE) {
            paginatedOptions.first = MAX_PAGE;
            paginatedOptions.orderBy = options.orderBy || "id";
            paginatedOptions.orderDirection = options.orderDirection || "asc";
            paginationKey = paginatedOptions.orderBy + (paginatedOptions.orderDirection === "asc" ? "_gt" : "_lt") as keyof ClaimedUnderlyingDealTokensFilter;
            paginatedOptions.where = { ...options.where };
        }
        let results: Pick<ClaimedUnderlyingDealTokensResult, K>[] = [];
        do {
            if (paginationKey && paginationValue)
                paginatedOptions.where![paginationKey] = paginationValue as any;
            const res = await axios.post(url, {
                query: generateGql("claimedUnderlyingDealTokenss", paginatedOptions, args)
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
                return formattedObj as Pick<ClaimedUnderlyingDealTokensResult, K>;
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
    return useQuery(["codegen-graphql", enabled ? generateGql("ClaimedUnderlyingDealTokenss", options, args) : null], async () => func(url, options!, args!), {
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
export const useGetDealCreatedById = <K extends keyof DealCreatedResult>(url: string, options?: SingleQueryOptions, args?: DealCreatedArgs<K>, queryOptions: UseQueryOptions<Pick<DealCreatedResult, K>> = {}) => {
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
    return useQuery(["codegen-graphql", enabled ? generateGql("DealCreated", options, args) : null], async () => func(url, options!, args!), {
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
export type DealDetailsFilter = {
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
export type DealDetailsResult = {
    id: string;
    underlyingDealToken: string;
    purchaseTokenTotalForDeal: Wei;
    underlyingDealTokenTotal: Wei;
    vestingPeriod: Wei;
    vestingCliff: Wei;
    proRataRedemptionPeriod: Wei;
    openRedemptionPeriod: Wei;
    holder: string;
    holderFundingExpiration: Wei;
    holderFundingDuration: Wei;
};
export type DealDetailsFields = {
    id: true;
    underlyingDealToken: true;
    purchaseTokenTotalForDeal: true;
    underlyingDealTokenTotal: true;
    vestingPeriod: true;
    vestingCliff: true;
    proRataRedemptionPeriod: true;
    openRedemptionPeriod: true;
    holder: true;
    holderFundingExpiration: true;
    holderFundingDuration: true;
};
export type DealDetailsArgs<K extends keyof DealDetailsResult> = {
    [Property in keyof Pick<DealDetailsFields, K>]: DealDetailsFields[Property];
};
export const useGetDealDetailsById = <K extends keyof DealDetailsResult>(url: string, options?: SingleQueryOptions, args?: DealDetailsArgs<K>, queryOptions: UseQueryOptions<Pick<DealDetailsResult, K>> = {}) => {
    const func = async function <K extends keyof DealDetailsResult>(url: string, options: SingleQueryOptions, args: DealDetailsArgs<K>): Promise<Pick<DealDetailsResult, K>> {
        const res = await axios.post(url, {
            query: generateGql("dealDetails", options, args)
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
        if (obj["openRedemptionPeriod"])
            formattedObj["openRedemptionPeriod"] = wei(obj["openRedemptionPeriod"], 0);
        if (obj["holder"])
            formattedObj["holder"] = obj["holder"];
        if (obj["holderFundingExpiration"])
            formattedObj["holderFundingExpiration"] = wei(obj["holderFundingExpiration"], 0);
        if (obj["holderFundingDuration"])
            formattedObj["holderFundingDuration"] = wei(obj["holderFundingDuration"], 0);
        return formattedObj as Pick<DealDetailsResult, K>;
    };
    const enabled = options && args;
    return useQuery(["codegen-graphql", enabled ? generateGql("DealDetails", options, args) : null], async () => func(url, options!, args!), {
        ...queryOptions,
        enabled: !!options && !!args,
    });
};
export const useGetDealDetailss = <K extends keyof DealDetailsResult>(url: string, options?: MultiQueryOptions<DealDetailsFilter, DealDetailsResult>, args?: DealDetailsArgs<K>, queryOptions: UseQueryOptions<Pick<DealDetailsResult, K>[]> = {}) => {
    const func = async function <K extends keyof DealDetailsResult>(url: string, options: MultiQueryOptions<DealDetailsFilter, DealDetailsResult>, args: DealDetailsArgs<K>): Promise<Pick<DealDetailsResult, K>[]> {
        const paginatedOptions: Partial<MultiQueryOptions<DealDetailsFilter, DealDetailsResult>> = { ...options };
        let paginationKey: keyof DealDetailsFilter | null = null;
        let paginationValue = "";
        if (options.first && options.first > MAX_PAGE) {
            paginatedOptions.first = MAX_PAGE;
            paginatedOptions.orderBy = options.orderBy || "id";
            paginatedOptions.orderDirection = options.orderDirection || "asc";
            paginationKey = paginatedOptions.orderBy + (paginatedOptions.orderDirection === "asc" ? "_gt" : "_lt") as keyof DealDetailsFilter;
            paginatedOptions.where = { ...options.where };
        }
        let results: Pick<DealDetailsResult, K>[] = [];
        do {
            if (paginationKey && paginationValue)
                paginatedOptions.where![paginationKey] = paginationValue as any;
            const res = await axios.post(url, {
                query: generateGql("dealDetailss", paginatedOptions, args)
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
                if (obj["openRedemptionPeriod"])
                    formattedObj["openRedemptionPeriod"] = wei(obj["openRedemptionPeriod"], 0);
                if (obj["holder"])
                    formattedObj["holder"] = obj["holder"];
                if (obj["holderFundingExpiration"])
                    formattedObj["holderFundingExpiration"] = wei(obj["holderFundingExpiration"], 0);
                if (obj["holderFundingDuration"])
                    formattedObj["holderFundingDuration"] = wei(obj["holderFundingDuration"], 0);
                return formattedObj as Pick<DealDetailsResult, K>;
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
    return useQuery(["codegen-graphql", enabled ? generateGql("DealDetailss", options, args) : null], async () => func(url, options!, args!), {
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
export type DepositDealTokensFilter = {
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
export type DepositDealTokensResult = {
    id: string;
    underlyingDealTokenAddress: string;
    depositor: string;
    dealContract: string;
    underlyingDealTokenAmount: Wei;
};
export type DepositDealTokensFields = {
    id: true;
    underlyingDealTokenAddress: true;
    depositor: true;
    dealContract: true;
    underlyingDealTokenAmount: true;
};
export type DepositDealTokensArgs<K extends keyof DepositDealTokensResult> = {
    [Property in keyof Pick<DepositDealTokensFields, K>]: DepositDealTokensFields[Property];
};
export const useGetDepositDealTokensById = <K extends keyof DepositDealTokensResult>(url: string, options?: SingleQueryOptions, args?: DepositDealTokensArgs<K>, queryOptions: UseQueryOptions<Pick<DepositDealTokensResult, K>> = {}) => {
    const func = async function <K extends keyof DepositDealTokensResult>(url: string, options: SingleQueryOptions, args: DepositDealTokensArgs<K>): Promise<Pick<DepositDealTokensResult, K>> {
        const res = await axios.post(url, {
            query: generateGql("depositDealTokens", options, args)
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
        return formattedObj as Pick<DepositDealTokensResult, K>;
    };
    const enabled = options && args;
    return useQuery(["codegen-graphql", enabled ? generateGql("DepositDealTokens", options, args) : null], async () => func(url, options!, args!), {
        ...queryOptions,
        enabled: !!options && !!args,
    });
};
export const useGetDepositDealTokenss = <K extends keyof DepositDealTokensResult>(url: string, options?: MultiQueryOptions<DepositDealTokensFilter, DepositDealTokensResult>, args?: DepositDealTokensArgs<K>, queryOptions: UseQueryOptions<Pick<DepositDealTokensResult, K>[]> = {}) => {
    const func = async function <K extends keyof DepositDealTokensResult>(url: string, options: MultiQueryOptions<DepositDealTokensFilter, DepositDealTokensResult>, args: DepositDealTokensArgs<K>): Promise<Pick<DepositDealTokensResult, K>[]> {
        const paginatedOptions: Partial<MultiQueryOptions<DepositDealTokensFilter, DepositDealTokensResult>> = { ...options };
        let paginationKey: keyof DepositDealTokensFilter | null = null;
        let paginationValue = "";
        if (options.first && options.first > MAX_PAGE) {
            paginatedOptions.first = MAX_PAGE;
            paginatedOptions.orderBy = options.orderBy || "id";
            paginatedOptions.orderDirection = options.orderDirection || "asc";
            paginationKey = paginatedOptions.orderBy + (paginatedOptions.orderDirection === "asc" ? "_gt" : "_lt") as keyof DepositDealTokensFilter;
            paginatedOptions.where = { ...options.where };
        }
        let results: Pick<DepositDealTokensResult, K>[] = [];
        do {
            if (paginationKey && paginationValue)
                paginatedOptions.where![paginationKey] = paginationValue as any;
            const res = await axios.post(url, {
                query: generateGql("depositDealTokenss", paginatedOptions, args)
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
                return formattedObj as Pick<DepositDealTokensResult, K>;
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
    return useQuery(["codegen-graphql", enabled ? generateGql("DepositDealTokenss", options, args) : null], async () => func(url, options!, args!), {
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
    timestamp?: WeiSource | null;
    timestamp_not?: WeiSource | null;
    timestamp_gt?: WeiSource | null;
    timestamp_lt?: WeiSource | null;
    timestamp_gte?: WeiSource | null;
    timestamp_lte?: WeiSource | null;
    timestamp_in?: WeiSource[];
    timestamp_not_in?: WeiSource[];
    hasAllowList?: boolean | null;
    hasAllowList_not?: boolean | null;
    hasAllowList_in?: boolean[];
    hasAllowList_not_in?: boolean[];
    poolStatus?: PoolStatusFilter | null;
    poolStatus_not?: PoolStatusFilter | null;
    poolStatus_in?: PoolStatusFilter[];
    poolStatus_not_in?: PoolStatusFilter[];
};
export type PoolCreatedResult = {
    id: string;
    name: string;
    symbol: string;
    purchaseTokenCap: Wei;
    purchaseToken: string;
    duration: Wei;
    sponsorFee: Wei;
    sponsor: string;
    purchaseDuration: Wei;
    purchaseExpiry: Wei;
    timestamp: Wei;
    hasAllowList: boolean;
    poolStatus: Partial<PoolStatusResult>;
};
export type PoolCreatedFields = {
    id: true;
    name: true;
    symbol: true;
    purchaseTokenCap: true;
    purchaseToken: true;
    duration: true;
    sponsorFee: true;
    sponsor: true;
    purchaseDuration: true;
    purchaseExpiry: true;
    timestamp: true;
    hasAllowList: true;
    poolStatus: PoolStatusFields;
};
export type PoolCreatedArgs<K extends keyof PoolCreatedResult> = {
    [Property in keyof Pick<PoolCreatedFields, K>]: PoolCreatedFields[Property];
};
export const useGetPoolCreatedById = <K extends keyof PoolCreatedResult>(url: string, options?: SingleQueryOptions, args?: PoolCreatedArgs<K>, queryOptions: UseQueryOptions<Pick<PoolCreatedResult, K>> = {}) => {
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
        if (obj["timestamp"])
            formattedObj["timestamp"] = wei(obj["timestamp"], 0);
        if (obj["hasAllowList"])
            formattedObj["hasAllowList"] = obj["hasAllowList"];
        if (obj["poolStatus"])
            formattedObj["poolStatus"] = obj["poolStatus"];
        return formattedObj as Pick<PoolCreatedResult, K>;
    };
    const enabled = options && args;
    return useQuery(["codegen-graphql", enabled ? generateGql("PoolCreated", options, args) : null], async () => func(url, options!, args!), {
        ...queryOptions,
        enabled: !!options && !!args,
    });
};
export const useGetPoolCreateds = <K extends keyof PoolCreatedResult>(url: string, options?: MultiQueryOptions<PoolCreatedFilter, PoolCreatedResult>, args?: PoolCreatedArgs<K>, queryOptions: UseQueryOptions<Pick<PoolCreatedResult, K>[]> = {}) => {
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
                if (obj["timestamp"])
                    formattedObj["timestamp"] = wei(obj["timestamp"], 0);
                if (obj["hasAllowList"])
                    formattedObj["hasAllowList"] = obj["hasAllowList"];
                if (obj["poolStatus"])
                    formattedObj["poolStatus"] = obj["poolStatus"];
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
    return useQuery(["codegen-graphql", enabled ? generateGql("PoolCreateds", options, args) : null], async () => func(url, options!, args!), {
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
};
export type PurchasePoolTokenResult = {
    id: string;
    purchaser: string;
    poolAddress: string;
    purchaseTokenAmount: Wei;
};
export type PurchasePoolTokenFields = {
    id: true;
    purchaser: true;
    poolAddress: true;
    purchaseTokenAmount: true;
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
        return formattedObj as Pick<PurchasePoolTokenResult, K>;
    };
    const enabled = options && args;
    return useQuery(["codegen-graphql", enabled ? generateGql("PurchasePoolToken", options, args) : null], async () => func(url, options!, args!), {
        ...queryOptions,
        enabled: !!options && !!args,
    });
};
export const useGetPurchasePoolTokens = <K extends keyof PurchasePoolTokenResult>(url: string, options?: MultiQueryOptions<PurchasePoolTokenFilter, PurchasePoolTokenResult>, args?: PurchasePoolTokenArgs<K>, queryOptions: UseQueryOptions<Pick<PurchasePoolTokenResult, K>[]> = {}) => {
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
    return useQuery(["codegen-graphql", enabled ? generateGql("PurchasePoolTokens", options, args) : null], async () => func(url, options!, args!), {
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
export type WithdrawUnderlyingDealTokensFilter = {
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
export type WithdrawUnderlyingDealTokensResult = {
    id: string;
    underlyingDealTokenAddress: string;
    depositor: string;
    dealContract: string;
    underlyingDealTokenAmount: Wei;
};
export type WithdrawUnderlyingDealTokensFields = {
    id: true;
    underlyingDealTokenAddress: true;
    depositor: true;
    dealContract: true;
    underlyingDealTokenAmount: true;
};
export type WithdrawUnderlyingDealTokensArgs<K extends keyof WithdrawUnderlyingDealTokensResult> = {
    [Property in keyof Pick<WithdrawUnderlyingDealTokensFields, K>]: WithdrawUnderlyingDealTokensFields[Property];
};
export const useGetWithdrawUnderlyingDealTokensById = <K extends keyof WithdrawUnderlyingDealTokensResult>(url: string, options?: SingleQueryOptions, args?: WithdrawUnderlyingDealTokensArgs<K>, queryOptions: UseQueryOptions<Pick<WithdrawUnderlyingDealTokensResult, K>> = {}) => {
    const func = async function <K extends keyof WithdrawUnderlyingDealTokensResult>(url: string, options: SingleQueryOptions, args: WithdrawUnderlyingDealTokensArgs<K>): Promise<Pick<WithdrawUnderlyingDealTokensResult, K>> {
        const res = await axios.post(url, {
            query: generateGql("withdrawUnderlyingDealTokens", options, args)
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
        return formattedObj as Pick<WithdrawUnderlyingDealTokensResult, K>;
    };
    const enabled = options && args;
    return useQuery(["codegen-graphql", enabled ? generateGql("WithdrawUnderlyingDealTokens", options, args) : null], async () => func(url, options!, args!), {
        ...queryOptions,
        enabled: !!options && !!args,
    });
};
export const useGetWithdrawUnderlyingDealTokenss = <K extends keyof WithdrawUnderlyingDealTokensResult>(url: string, options?: MultiQueryOptions<WithdrawUnderlyingDealTokensFilter, WithdrawUnderlyingDealTokensResult>, args?: WithdrawUnderlyingDealTokensArgs<K>, queryOptions: UseQueryOptions<Pick<WithdrawUnderlyingDealTokensResult, K>[]> = {}) => {
    const func = async function <K extends keyof WithdrawUnderlyingDealTokensResult>(url: string, options: MultiQueryOptions<WithdrawUnderlyingDealTokensFilter, WithdrawUnderlyingDealTokensResult>, args: WithdrawUnderlyingDealTokensArgs<K>): Promise<Pick<WithdrawUnderlyingDealTokensResult, K>[]> {
        const paginatedOptions: Partial<MultiQueryOptions<WithdrawUnderlyingDealTokensFilter, WithdrawUnderlyingDealTokensResult>> = { ...options };
        let paginationKey: keyof WithdrawUnderlyingDealTokensFilter | null = null;
        let paginationValue = "";
        if (options.first && options.first > MAX_PAGE) {
            paginatedOptions.first = MAX_PAGE;
            paginatedOptions.orderBy = options.orderBy || "id";
            paginatedOptions.orderDirection = options.orderDirection || "asc";
            paginationKey = paginatedOptions.orderBy + (paginatedOptions.orderDirection === "asc" ? "_gt" : "_lt") as keyof WithdrawUnderlyingDealTokensFilter;
            paginatedOptions.where = { ...options.where };
        }
        let results: Pick<WithdrawUnderlyingDealTokensResult, K>[] = [];
        do {
            if (paginationKey && paginationValue)
                paginatedOptions.where![paginationKey] = paginationValue as any;
            const res = await axios.post(url, {
                query: generateGql("withdrawUnderlyingDealTokenss", paginatedOptions, args)
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
                return formattedObj as Pick<WithdrawUnderlyingDealTokensResult, K>;
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
    return useQuery(["codegen-graphql", enabled ? generateGql("WithdrawUnderlyingDealTokenss", options, args) : null], async () => func(url, options!, args!), {
        ...queryOptions,
        enabled: !!options && !!args,
    });
};
