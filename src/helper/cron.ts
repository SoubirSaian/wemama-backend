import cron from "node-cron";
// import { generateDailyInventoryService,resetSupplierDailyFieldsService } from "../app/module/Inventory/Inventory.service";

//make all user's matchCount to 0 at everyday night



// -------------------------------
// SAFE WRAPPER
// -------------------------------
const safeRun = async (label: string, cronServiceFunction: any) => {
  try {

    console.log(`[CRON] Starting: ${label}`);

    await cronServiceFunction();

    console.log(`[CRON] Completed: ${label}`);

  } catch (err) {
    
    console.error(`[CRON ERROR] in "${label}":`, err);
  }
};

const runCronJobEverydatAtNight = () => {
    // Schedule the task
    // “50 23 * * *” means every day at 23:50 (11:50 PM)
    
    // cron.schedule("50 23 * * *", async () => {
    
    //   console.log("Running daily inventory generation…");
    
    //   await generateDailyInventoryService();
    //   await resetSupplierDailyFieldsService();
    // });

    // Run at 23:50
    cron.schedule("50 23 * * *", async () => {
    //   await safeRun("Generate daily inventry for Supplier", generateDailyInventoryService);
    }, {
      timezone: "Asia/Dhaka"
    });

    // Run at 23:50
    cron.schedule("58 23 * * *", async () => {
    //   await safeRun("Update supplier field after inventory generation", resetSupplierDailyFieldsService);
    }, {
      timezone: "Asia/Dhaka"
    });

    
}

// {
//     timezone: "Asia/Dhaka"
// }

export default runCronJobEverydatAtNight;