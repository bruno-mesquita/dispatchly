"use client";

import { useState } from "react";

export type AdminUser = {
	id: string;
	name: string;
	email: string;
	emailVerified: boolean;
	image?: string;
	sessionCount: number;
	createdAt: string;
};

const PAGE_SIZE = 20;

const MOCK: AdminUser[] = [
	{
		id: "user_1",
		name: "Alice Martins",
		email: "alice@acmecorp.com",
		emailVerified: true,
		sessionCount: 12,
		createdAt: "2024-01-15T10:00:00Z",
	},
	{
		id: "user_2",
		name: "Bob Silva",
		email: "bob@techstartup.io",
		emailVerified: true,
		sessionCount: 3,
		createdAt: "2024-02-20T14:30:00Z",
	},
	{
		id: "user_3",
		name: "Carol Santos",
		email: "carol@globalretail.com",
		emailVerified: true,
		sessionCount: 28,
		createdAt: "2023-11-08T09:15:00Z",
	},
	{
		id: "user_4",
		name: "David Costa",
		email: "david@devshop.dev",
		emailVerified: false,
		sessionCount: 1,
		createdAt: "2024-03-05T16:45:00Z",
	},
	{
		id: "user_5",
		name: "Eva Oliveira",
		email: "eva@healthtech.com",
		emailVerified: true,
		sessionCount: 7,
		createdAt: "2024-01-28T11:20:00Z",
	},
	{
		id: "user_6",
		name: "Felipe Lima",
		email: "felipe@edu.io",
		emailVerified: true,
		sessionCount: 5,
		createdAt: "2024-02-14T08:00:00Z",
	},
	{
		id: "user_7",
		name: "Gabriela Rocha",
		email: "gabriela@finance.io",
		emailVerified: true,
		sessionCount: 41,
		createdAt: "2023-09-12T13:30:00Z",
	},
	{
		id: "user_8",
		name: "Hugo Alves",
		email: "hugo@localbiz.com",
		emailVerified: false,
		sessionCount: 0,
		createdAt: "2024-04-01T10:00:00Z",
	},
];

export function useUsers() {
	const [page, setPage] = useState(1);
	const [search, setSearch] = useState("");

	// TODO: replace with trpc.admin.users.list.useQuery({ page, limit: PAGE_SIZE, search })
	const filtered = MOCK.filter(
		(u) =>
			!search ||
			u.name.toLowerCase().includes(search.toLowerCase()) ||
			u.email.toLowerCase().includes(search.toLowerCase()),
	);
	const items = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

	return {
		users: items,
		total: filtered.length,
		page,
		setPage,
		search,
		setSearch,
		isLoading: false as const,
		error: null,
	};
}
