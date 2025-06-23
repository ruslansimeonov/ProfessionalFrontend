# Frontend tRPC Migration Guide

## ✅ Completed Setup

### 1. **Core Files Created**

- `lib/trpc.ts` - tRPC client configuration
- `types/trpc.ts` - Type exports and inference
- `app/components/TRPCProvider.tsx` - React Query provider with tRPC
- `app/layout.tsx` - Updated with TRPCProvider

### 2. **tRPC Hooks Created**

- `app/hooks/trpc/useGroupsTRPC.ts` - Main groups management
- `app/hooks/trpc/useGroupManagementTRPC.ts` - Group details & management
- `app/hooks/trpc/useAvailableUsersTRPC.ts` - Available users for groups

### 3. **Migration Support**

- `app/utils/apis/groupsTRPC.ts` - Legacy API wrapper using tRPC
- `app/hooks/useGroups.ts` - Updated to use tRPC internally
- `app/utils/apis/groups.ts` - Added migration comments

### 4. **Example Implementation**

- `app/(routes)/groups/page-trpc.tsx` - Complete tRPC implementation example

## 🚀 **Benefits You Now Have**

### **Type Safety**

- ✅ End-to-end type safety from backend to frontend
- ✅ Auto-completion in IDEs
- ✅ Compile-time error checking
- ✅ No more manual type definitions

### **Better Developer Experience**

- ✅ Automatic data fetching with React Query
- ✅ Built-in loading, error, and success states
- ✅ Optimistic updates support
- ✅ Automatic refetching and caching

### **Performance**

- ✅ Request batching
- ✅ Intelligent caching
- ✅ Background refetching
- ✅ Reduced bundle size (no Axios overhead)

## 📋 **Migration Steps**

### **Phase 1: Immediate Benefits**

You can start using tRPC hooks in new components immediately:

```tsx
// Instead of this (REST):
import { useGroups } from "@/app/hooks/useGroups";
const { groups, loading, error } = useGroups();

// Use this (tRPC):
import { useGroupsTRPC } from "@/app/hooks/trpc/useGroupsTRPC";
const { groups, loading, error } = useGroupsTRPC();
```

### **Phase 2: Component Migration**

Replace existing components one by one:

1. **Groups Page**: Use `page-trpc.tsx` as reference
2. **Group Management Dialog**: Update to use `useGroupManagementTRPC`
3. **Add Users Dialog**: Update to use `useAvailableUsersTRPC`

### **Phase 3: Remove Legacy Code**

After all components are migrated:

1. Remove REST API calls from `utils/apis/groups.ts`
2. Remove old hooks
3. Clean up unused imports

## 🔧 **How to Use tRPC Hooks**

### **Basic Groups Management**

```tsx
import { useGroupsTRPC } from "@/app/hooks/trpc/useGroupsTRPC";

export function GroupsList() {
  const { groups, total, loading, error, createGroup, loadGroups } =
    useGroupsTRPC();

  // Load groups on mount
  useEffect(() => {
    loadGroups({ page: 1, pageSize: 10 });
  }, []);

  // Create new group
  const handleCreate = async () => {
    await createGroup({
      name: "New Group",
      companyId: 123,
    });
    // Automatically refetches the list!
  };

  return (
    <div>
      {loading && <div>Loading...</div>}
      {error && <div>Error: {error}</div>}
      {groups.map((group) => (
        <div key={group.id}>{group.name}</div>
      ))}
    </div>
  );
}
```

### **Group Details & Management**

```tsx
import { useGroupManagementTRPC } from "@/app/hooks/trpc/useGroupManagementTRPC";

export function GroupDetails({ groupId }: { groupId: number }) {
  const { group, capacity, invitations, createInvitation, addUsers } =
    useGroupManagementTRPC(groupId);

  return (
    <div>
      <h2>{group?.name}</h2>
      <p>
        Capacity: {capacity?.currentParticipants}/{capacity?.maxParticipants}
      </p>

      <button
        onClick={() =>
          createInvitation({
            expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
            maxUses: 50,
          })
        }
      >
        Create Invitation
      </button>
    </div>
  );
}
```

## 🎯 **Next Steps**

1. **Test the setup**: Try using the tRPC hooks in a simple component
2. **Update your main groups page**: Replace `page.tsx` with `page-trpc.tsx` content
3. **Migrate other group components** one by one
4. **Add error boundaries** for better error handling
5. **Consider adding optimistic updates** for better UX

## ⚠️ **Important Notes**

- **Backend URL**: Make sure `http://localhost:5000/api/trpc` is correct in `TRPCProvider.tsx`
- **Authentication**: Tokens are automatically included from localStorage
- **Type Imports**: You may need to adjust import paths based on your backend location
- **Gradual Migration**: You can use both REST and tRPC side by side during migration

Your frontend is now ready for type-safe, efficient data fetching with tRPC! 🎉
