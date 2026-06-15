/**
 * React Hooks for API Integration
 * Provides easy-to-use hooks with React Query integration
 */

import { useQuery, useMutation, useQueryClient, UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import api, { ApiError, ApiResponse } from '@/lib/api-client';
import type * as Types from '@shared/api-types';

// ============================================================================
// AUTHENTICATION HOOKS
// ============================================================================

export function useLogin() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ username, password }: { username: string; password: string }) =>
      api.auth.login(username, password),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user'] });
      queryClient.invalidateQueries({ queryKey: ['player-state'] });
    },
  });
}

export function useRegister() {
  return useMutation({
    mutationFn: ({ username, password, email }: { username: string; password: string; email?: string }) =>
      api.auth.register(username, password, email),
  });
}

export function useLogout() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: () => api.auth.logout(),
    onSuccess: () => {
      queryClient.clear();
    },
  });
}

// ============================================================================
// USER HOOKS
// ============================================================================

export function useUser(options?: UseQueryOptions<ApiResponse<Types.User>>) {
  return useQuery({
    queryKey: ['user', 'me'],
    queryFn: () => api.user.getMe(),
    staleTime: 5 * 60 * 1000, // 5 minutes
    ...options,
  });
}

// ============================================================================
// PLAYER STATE HOOKS
// ============================================================================

export function usePlayerState(options?: UseQueryOptions<ApiResponse<Types.PlayerState>>) {
  return useQuery({
    queryKey: ['player-state'],
    queryFn: () => api.player.getState(),
    staleTime: 30 * 1000, // 30 seconds
    refetchInterval: 60 * 1000, // Refetch every minute
    ...options,
  });
}

export function useUpdatePlayerState() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (updates: Partial<Types.PlayerState>) => api.player.updateState(updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['player-state'] });
    },
  });
}

// ============================================================================
// RESOURCES HOOKS
// ============================================================================

export function useResources(options?: UseQueryOptions<ApiResponse<Types.Resources>>) {
  return useQuery({
    queryKey: ['resources'],
    queryFn: () => api.resources.get(),
    staleTime: 30 * 1000,
    refetchInterval: 60 * 1000,
    ...options,
  });
}

export function useUpdateResources() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (resources: Partial<Types.Resources>) => api.resources.update(resources),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['resources'] });
      queryClient.invalidateQueries({ queryKey: ['player-state'] });
    },
  });
}

// ============================================================================
// BUILDINGS HOOKS
// ============================================================================

export function useBuildings(options?: UseQueryOptions<ApiResponse<Types.Buildings>>) {
  return useQuery({
    queryKey: ['buildings'],
    queryFn: () => api.buildings.getAll(),
    staleTime: 60 * 1000,
    ...options,
  });
}

export function useBuildStructure() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ buildingId, level }: { buildingId: string; level?: number }) =>
      api.buildings.build(buildingId, level),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['buildings'] });
      queryClient.invalidateQueries({ queryKey: ['resources'] });
      queryClient.invalidateQueries({ queryKey: ['build-queue'] });
    },
  });
}

export function useBuildQueue(options?: UseQueryOptions<ApiResponse<Types.BuildQueueItem[]>>) {
  return useQuery({
    queryKey: ['build-queue'],
    queryFn: () => api.buildings.getQueue(),
    staleTime: 30 * 1000,
    refetchInterval: 30 * 1000,
    ...options,
  });
}

// ============================================================================
// RESEARCH HOOKS
// ============================================================================

export function useResearchTree(options?: UseQueryOptions<ApiResponse<Record<string, Types.Technology>>>) {
  return useQuery({
    queryKey: ['research-tree'],
    queryFn: () => api.research.getTree(),
    staleTime: 5 * 60 * 1000, // 5 minutes
    ...options,
  });
}

export function useStartResearch() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ techId, priority }: { techId: string; priority?: 'low' | 'normal' | 'high' }) =>
      api.research.start(techId, priority),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['research-queue'] });
      queryClient.invalidateQueries({ queryKey: ['resources'] });
    },
  });
}

export function useResearchQueue(options?: UseQueryOptions<ApiResponse<Types.ResearchQueueItem[]>>) {
  return useQuery({
    queryKey: ['research-queue'],
    queryFn: () => api.research.getQueue(),
    staleTime: 30 * 1000,
    refetchInterval: 30 * 1000,
    ...options,
  });
}

// ============================================================================
// FLEET HOOKS
// ============================================================================

export function useFleets(options?: UseQueryOptions<ApiResponse<Types.Fleet[]>>) {
  return useQuery({
    queryKey: ['fleets'],
    queryFn: () => api.fleet.getAll(),
    staleTime: 30 * 1000,
    refetchInterval: 60 * 1000,
    ...options,
  });
}

export function useCreateFleet() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ name, ships }: { name: string; ships: Record<string, number> }) =>
      api.fleet.create(name, ships),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['fleets'] });
      queryClient.invalidateQueries({ queryKey: ['resources'] });
    },
  });
}

export function useSendFleet() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ fleetId, destination, mission }: { fleetId: string; destination: string; mission: string }) =>
      api.fleet.send(fleetId, destination, mission),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['fleets'] });
    },
  });
}

// ============================================================================
// MISSIONS HOOKS
// ============================================================================

export function useMissions(options?: UseQueryOptions<ApiResponse<Types.Mission[]>>) {
  return useQuery({
    queryKey: ['missions'],
    queryFn: () => api.missions.getAll(),
    staleTime: 30 * 1000,
    refetchInterval: 60 * 1000,
    ...options,
  });
}

export function useCreateMission() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (missionData: Types.CreateMissionRequest) => api.missions.create(missionData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['missions'] });
    },
  });
}

// ============================================================================
// COMBAT HOOKS
// ============================================================================

export function useCombatFormations(options?: UseQueryOptions<ApiResponse<Types.CombatFormation[]>>) {
  return useQuery({
    queryKey: ['combat-formations'],
    queryFn: () => api.combat.getFormations(),
    staleTime: 10 * 60 * 1000, // 10 minutes
    ...options,
  });
}

export function useSimulateCombat() {
  return useMutation({
    mutationFn: ({ attacker, defender }: { attacker: Types.CombatSide; defender: Types.CombatSide }) =>
      api.combat.simulate(attacker, defender),
  });
}

// ============================================================================
// ALLIANCE HOOKS
// ============================================================================

export function useAlliances(options?: UseQueryOptions<ApiResponse<Types.Alliance[]>>) {
  return useQuery({
    queryKey: ['alliances'],
    queryFn: () => api.alliance.getAll(),
    staleTime: 2 * 60 * 1000, // 2 minutes
    ...options,
  });
}

export function useMyAlliance(options?: UseQueryOptions<ApiResponse<Types.Alliance>>) {
  return useQuery({
    queryKey: ['my-alliance'],
    queryFn: () => api.alliance.getMy(),
    staleTime: 60 * 1000,
    ...options,
  });
}

export function useCreateAlliance() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ name, description }: { name: string; description?: string }) =>
      api.alliance.create(name, description),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['alliances'] });
      queryClient.invalidateQueries({ queryKey: ['my-alliance'] });
    },
  });
}

// ============================================================================
// CURRENCY & BANK HOOKS
// ============================================================================

export function useCurrency(options?: UseQueryOptions<ApiResponse<Types.Currency>>) {
  return useQuery({
    queryKey: ['currency'],
    queryFn: () => api.currency.getBalance(),
    staleTime: 30 * 1000,
    refetchInterval: 60 * 1000,
    ...options,
  });
}

export function useBankAccount(options?: UseQueryOptions<ApiResponse<Types.BankAccount>>) {
  return useQuery({
    queryKey: ['bank-account'],
    queryFn: () => api.bank.getAccount(),
    staleTime: 30 * 1000,
    ...options,
  });
}

export function useBankDeposit() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (amount: number) => api.bank.deposit(amount),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bank-account'] });
      queryClient.invalidateQueries({ queryKey: ['currency'] });
    },
  });
}

export function useBankWithdraw() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (amount: number) => api.bank.withdraw(amount),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bank-account'] });
      queryClient.invalidateQueries({ queryKey: ['currency'] });
    },
  });
}

// ============================================================================
// EMPIRE HOOKS
// ============================================================================

export function useEmpireValue(options?: UseQueryOptions<ApiResponse<Types.EmpireValue>>) {
  return useQuery({
    queryKey: ['empire-value'],
    queryFn: () => api.empire.getValue(),
    staleTime: 2 * 60 * 1000,
    ...options,
  });
}

export function useEmpireRankings(options?: UseQueryOptions<ApiResponse<Types.EmpireRanking[]>>) {
  return useQuery({
    queryKey: ['empire-rankings'],
    queryFn: () => api.empire.getRankings(),
    staleTime: 5 * 60 * 1000,
    ...options,
  });
}

// ============================================================================
// MARKET HOOKS
// ============================================================================

export function useMarketOrders(filters?: any, options?: UseQueryOptions<ApiResponse<Types.MarketOrder[]>>) {
  return useQuery({
    queryKey: ['market-orders', filters],
    queryFn: () => api.market.getOrders(filters),
    staleTime: 30 * 1000,
    ...options,
  });
}

export function useCreateMarketOrder() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (orderData: Types.CreateOrderRequest) => api.market.createOrder(orderData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['market-orders'] });
    },
  });
}

// ============================================================================
// AUCTION HOOKS
// ============================================================================

export function useAuctions(filters?: any, options?: UseQueryOptions<ApiResponse<Types.AuctionListing[]>>) {
  return useQuery({
    queryKey: ['auctions', filters],
    queryFn: () => api.auction.getListings(filters),
    staleTime: 30 * 1000,
    refetchInterval: 60 * 1000,
    ...options,
  });
}

export function useCreateAuction() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (auctionData: Types.CreateAuctionRequest) => api.auction.create(auctionData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['auctions'] });
    },
  });
}

export function usePlaceBid() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ auctionId, bidAmount }: { auctionId: string; bidAmount: number }) =>
      api.auction.bid(auctionId, bidAmount),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['auctions'] });
      queryClient.invalidateQueries({ queryKey: ['currency'] });
    },
  });
}

// ============================================================================
// EXPEDITIONS HOOKS
// ============================================================================

export function useExpeditions(options?: UseQueryOptions<ApiResponse<Types.Expedition[]>>) {
  return useQuery({
    queryKey: ['expeditions'],
    queryFn: () => api.expeditions.getAll(),
    staleTime: 30 * 1000,
    refetchInterval: 60 * 1000,
    ...options,
  });
}

export function useCreateExpedition() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (expeditionData: Types.CreateExpeditionRequest) => api.expeditions.create(expeditionData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['expeditions'] });
    },
  });
}

// ============================================================================
// GALAXY HOOKS
// ============================================================================

export function useGalaxySystems(galaxyId?: string, options?: UseQueryOptions<ApiResponse<Types.StarSystem[]>>) {
  return useQuery({
    queryKey: ['galaxy-systems', galaxyId],
    queryFn: () => api.galaxy.getSystems(galaxyId),
    staleTime: 5 * 60 * 1000,
    ...options,
  });
}

export function useGalaxyScan() {
  return useMutation({
    mutationFn: (coordinates: string) => api.galaxy.scan(coordinates),
  });
}

// ============================================================================
// INVENTORY HOOKS
// ============================================================================

export function useInventory(options?: UseQueryOptions<ApiResponse<Types.InventoryItem[]>>) {
  return useQuery({
    queryKey: ['inventory'],
    queryFn: () => api.inventory.getAll(),
    staleTime: 60 * 1000,
    ...options,
  });
}

export function useUseItem() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ itemId, quantity }: { itemId: string; quantity?: number }) =>
      api.inventory.use(itemId, quantity),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inventory'] });
    },
  });
}

// ============================================================================
// UTILITY HOOKS
// ============================================================================

export function useApiStatus(options?: UseQueryOptions<ApiResponse<Types.HealthStatus>>) {
  return useQuery({
    queryKey: ['api-status'],
    queryFn: () => api.status.getHealth(),
    staleTime: 60 * 1000,
    refetchInterval: 60 * 1000,
    ...options,
  });
}

// Made with Bob
