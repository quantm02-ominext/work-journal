import { useId } from 'react'

export type Overrides<Part extends string> = Partial<
	Record<Part | 'id', string | undefined>
>

export const useElementIds = <const Part extends string>(
	scope: string,
	parts: readonly Part[],
	overrides?: Overrides<Part>,
) => {
	const defaultId = useId()
	const id = overrides?.id ?? defaultId

	const elementIds = parts.reduce(
		(ids, partName) => {
			const partId = overrides?.[partName] ?? `${scope}-${id}-${partName}`

			ids[partName] = partId

			return ids
		},
		{
			id,
		} as Record<Part | 'id', string>,
	)

	return elementIds
}
