export const queryKey = {
  chat: {
    userId: ['userId'],
    ownerId: (roomId: string) => ['partyOwner', roomId],
    members: (roomId: string) => ['userData', roomId],
    messages: (roomId: string) => ['messages', roomId]
  }
};
