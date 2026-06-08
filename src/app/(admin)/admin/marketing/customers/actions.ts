"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function addCustomer(data: { name: string; email: string; phone?: string }) {
  try {
    await prisma.customer.create({
      data: {
        name: data.name,
        email: data.email,
        phone: data.phone || null,
      },
    });
    revalidatePath("/admin/marketing/customers");
    revalidatePath("/admin/marketing");
    return { success: true };
  } catch (error: any) {
    if (error.code === "P2002") {
      return { success: false, error: "A customer with this email already exists." };
    }
    return { success: false, error: "Failed to add customer." };
  }
}

export async function bulkImportCustomers(customers: { name: string; email: string; phone?: string }[]) {
  try {
    // Upsert or skip existing
    let added = 0;
    for (const c of customers) {
      if (!c.email || !c.name) continue;
      
      const existing = await prisma.customer.findUnique({ where: { email: c.email } });
      if (!existing) {
        await prisma.customer.create({
          data: {
            name: c.name,
            email: c.email,
            phone: c.phone || null,
          }
        });
        added++;
      }
    }
    revalidatePath("/admin/marketing/customers");
    revalidatePath("/admin/marketing");
    return { success: true, count: added };
  } catch (error: any) {
    return { success: false, error: "Failed to bulk import customers." };
  }
}

export async function deleteCustomer(id: string) {
  try {
    await prisma.customer.delete({
      where: { id },
    });
    revalidatePath("/admin/marketing/customers");
    return { success: true };
  } catch (error) {
    return { success: false, error: "Failed to delete customer." };
  }
}
