'use server';
import { revalidatePath } from 'next/cache';

/** Called after every save so the public site updates instantly. */
export async function refreshSite() {
  revalidatePath('/', 'layout');
}
