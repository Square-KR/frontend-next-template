"use client";

import { useParams } from "next/navigation";

export const SquareParams = <T extends Record<string, string>>() => {
	return useParams() as unknown as T;
};
