'use client';

import React, {useEffect} from 'react';
import { Select } from '@radix-ui/themes';
import { Issue, User } from '@prisma/client';
import axios from 'axios';
import { useQuery } from '@tanstack/react-query'
import Skeleton from 'react-loading-skeleton';

const AssigneeSelect = ({issue}: {issue: Issue }) => {

  const {data: users, error, isLoading} = useQuery<User[]>({
    queryKey: ['users'],
    queryFn: async () => {
      const {data} = await axios.get<User[]>('/api/users');
      return data;
    },
    staleTime: 1000 * 60 * 5,
    retry: 3
  })

  const handleAssigneeChange = (userId: string) => {
    axios.patch(`/api/issues/${issue.id}`, {assignedToUserId: userId === "unassigned" ? null : userId})
  }

  if(isLoading) return <Skeleton/>

  if (error) return null

  return (
    <Select.Root 
    defaultValue={issue.assignedToUserId ? issue.assignedToUserId : "unassigned"}
    onValueChange={(userId) => handleAssigneeChange(userId)}
    >
      <Select.Trigger placeholder="Assign..." />
      <Select.Content>
        <Select.Group>
          <Select.Label>Suggestions</Select.Label>
          <Select.Item value={"unassigned"}>Unassigned</Select.Item>
          {users?.map((user) => (
            <Select.Item key={user.id} value={user.id}>
              {user.name}
            </Select.Item>
          ))}
        </Select.Group>
      </Select.Content>
    </Select.Root>
  );
}

export default AssigneeSelect