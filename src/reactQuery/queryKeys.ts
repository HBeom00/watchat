export const queryKey = {
  chat: {
    userId: ['userId'],
    ownerId: (roomId: string) => ['ownerId', roomId],
    members: (roomId: string) => ['members', roomId],
    messages: (roomId: string) => ['messages', roomId]
  }
};
