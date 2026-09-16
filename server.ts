import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

dotenv.config();

// Supabase client initialization
const supabaseUrl = process.env.SUPABASE_URL || "";
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "";

const hasSupabase = supabaseUrl && supabaseKey;
let supabase: ReturnType<typeof createClient> | null = null;

if (hasSupabase) {
  supabase = createClient(supabaseUrl, supabaseKey);
}

// In-memory fallback data for preview if Supabase is not configured
let mockDeliveryFee = 20;
let mockDrivers = [
  { id: "1", name: "Ahmed Driver", phone: "0501112222", assigned_city: "Riyadh", assigned_district: "Al Malqa" }
];
let mockOrders: any[] = [];
const mockProducts = [
  {
    id: "1",
    name: "باقة ورد أحمر كلاسيكي",
    category: "european",
    price: 250,
    image_url: "https://lh3.googleusercontent.com/aida-public/AB6AXuAV4-FTA6wn-SjiJYdeky1ujsy6sAXENrkiOlkg8z-FPWzw87HGC2Xz4bUZZrHGAaviY9ZQ_oxnWTF2JVnOyK1SqFLV2GVPh8hxtPpnD37pm4Fzd9ctqGqdEtGZIcaVUwfCZ0qC2LPcGiPXvykYXP0WzaIF3dAkUZBZ5QvgAQO-1fg2h7RMNuA_4JI8ZAUxFKD0wP6CjiPQGMKl5nD9tZ9PTlc5A7xtYtS6tVkxcOhsYt84gjejlYP3",
    rating: 4.9,
    tag: "الأكثر مبيعاً",
    tagColor: "bg-primary text-on-primary"
  },
  {
    id: "2",
    name: "زهور البيوني الوردية الملكية",
    category: "special",
    price: 420,
    image_url: "https://lh3.googleusercontent.com/aida-public/AB6AXuAWbJXUMmggr0BLHavAUjtRWgHsSWUW7k3RJstnKmj9GUd45aPjqxHVFXp42_tBdG6MdWLFve-e8cjn_z7I5QB0bp8lTfQyJs3Ld4N77845jue3FrXbVfHZ-WR9Ii_NRon62tsiOPtpsG8bGXNr66HXcRUhR6L-AxBgByVGzHj4yaCXbAPT7HIva4YxBGqxmCaQpC0VqnlO3i0QLNDdEbec8-N5l-AMr3nF1WKhMXiqpPqY6_uFsEup",
    rating: 5.0,
    tag: "جديد",
    tagColor: "bg-secondary text-on-secondary"
  },
  {
    id: "3",
    name: "باقة توليب أبيض نقي",
    category: "european",
    price: 310,
    image_url: "https://lh3.googleusercontent.com/aida-public/AB6AXuCKc5kJ84_aYSVSMF9vLRFoQhxsgF_0NPpgZJTverau1D3qPqLkiTUMu-TaZ5Y4ng-LgHfaw0gY7ss1M9fz65AbrGFheE6tkilUL8qN1a8m4qOVH1ILlE5ttVfTnDka890llsUpNH2R600UuR9IbReqJ_PoBlm4y3V6bSFfzfTtNN1XXcJ-KRwJ6yPXsS0Ey049TTmw8OhipwqgDyDrdwCFwBlgmtQCtudLewb-kPP57IsCr--iI_NG",
    rating: 4.8,
    tag: "استيراد هولندي",
    tagColor: "bg-surface-container-highest text-on-surface-variant"
  },
  {
    id: "4",
    name: "تنسيق أوركيد فاخر",
    category: "chinese",
    price: 550,
    image_url: "https://lh3.googleusercontent.com/aida-public/AB6AXuC6fvN4gtKEbrbHhXa4yYUHCUkzXFkpPRWfsby8AzQpX50HGsqq0ui-00lTTr7gRKkD4iKl1WZTjlb2on6Jr_IlzxpowFOXnOrqNdnMBbBYaY-EKIY7FLZh5Z8wiJdYxS7UejqxEpCmQ7SHaKkE2xksX62O1Kd80viwFn-TyfQ6Eu1qP9k6S8fnJZ4C-cO2P-Z9f4ZpGKbNBf_1JBKb4ENepe7QVGZPEb5_diTMTC12yeFVwYWMN1d8",
    rating: 4.9,
    tag: "فاخر للغاية",
    tagColor: "bg-tertiary-container text-on-tertiary-container"
  },
  {
    id: "5",
    name: "باقة ريفية مع اللافندر",
    category: "local",
    price: 280,
    image_url: "https://lh3.googleusercontent.com/aida-public/AB6AXuCxQEURDKBVr1XyiUhtJSBDg4DYyPuZtLqaJ04SR_Q9B_b0kOFZF6s-zmu38sHEoxtm2bIXHOfLxPa0_vrsJyDKwPd7wu_OU3H1_EwqEAOPvaY1kC7sLeWe1H5qFRmKQA-CQBKUuxMJyxksh_MDQKpN-xsbvUzdN-V_OUJDAz4q_f0kFpIQpyqce55cUAZwWs-_59GCEUeA9SZX9jlQKcTh9P-hMLg6jc3pLXfQ1VKuMc3k65EmQBng",
    rating: 4.7,
    tag: "أريج عطري",
    tagColor: "bg-secondary-container text-on-secondary-container"
  },
  {
    id: "6",
    name: "صندوق الورد الجوري والكرز",
    category: "special",
    price: 480,
    originalPrice: 565,
    image_url: "https://lh3.googleusercontent.com/aida-public/AB6AXuCSw87aS0ZdRzsgXrJZset2kd6MlZ1xF8c5XWxAOPVrr8ZoKfGaSUYbzxTKnOZ32XCm4Uv1tGjFFa_0XM4zQT510Oxe1Q9kkGDOoKI5UrpOHPHiViaO56_VBRhMw_1gKVdGxTw67LkiyxkTPubFjqyzqf1bLJbfNrqwFvb3bjENo08yu8-LAMVefN9qeOfquBg7KkShvTuCxO-HN5-BPhxXKe4d8etkKNjO49dSbtzFsJxJBkAYHH7K",
    rating: 4.9,
    tag: "خصم 15%",
    tagColor: "bg-error-container text-on-error-container"
  },
  {
    id: "7",
    name: "باقة زنابق كازابلانكا العطرة",
    category: "local",
    price: 390,
    image_url: "https://lh3.googleusercontent.com/aida-public/AB6AXuDkSbwj4YKJiUuQ3ZDr7g5nPfn_ZSQQ92wwJfs4QjRst4577Ed1ScK61CwBDF1GqrZrhcRSth6JH99x6oCPtTTf_vVP4DoYuuLoTn3QEEme-76HcU3S1-GAS1l7ucgTfkZGQU6t-JHy5BFychvQoiXCOWMTft2d68Kf4QSh_TNdvtuGuGyVekctL6X9UiKFGrPMkxK2mPPBK-YRzGSpj_6nqBsrLGF2dh2ts6a4DQMPYl-jGd5TwrOB",
    rating: 4.8,
    tag: null,
    tagColor: null
  },
  {
    id: "8",
    name: "تنسيق الورد المجفف الذهبي",
    category: "chinese",
    price: 340,
    image_url: "https://lh3.googleusercontent.com/aida-public/AB6AXuCt6nWay8rXdYjoS7vbbM7w9OOnGMdoMCzLr8lnBBjfi1fk58mD7qyHl-pt29D8Lb7YT2PhXdMHIyAeckRRGkAF0aZ4zefeBF6J58NpRuowEGWTH2SvgQmK6E6pKPymgErOxIg8LZAoKVamHD2YmGiFGpKFdZikfsFab1UGjosbqAwbrTI9Y107fbapvJnah9txVY3OMlrOr4nsy7E5YO32XXpDLELh69wmopWEWBWs3-XPW5xRiapl",
    rating: 4.9,
    tag: "يدوم لسنوات",
    tagColor: "bg-tertiary-fixed text-on-tertiary-fixed"
  }
];

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // GET /api/settings - Fetch global store settings
  app.get("/api/settings", async (req, res) => {
    if (supabase) {
      try {
        const { data, error } = await supabase
          .from("store_settings")
          .select("setting_value")
          .eq("setting_key", "delivery_fee")
          .single();
        
        if (error) throw error;
        return res.json({ deliveryFee: parseInt(data.setting_value) || 20 });
      } catch (err: any) {
        console.warn("Supabase request failed. Using mock data. Please verify your Supabase URL/Key and ensure schema.sql is executed.");
        return res.json({ deliveryFee: mockDeliveryFee });
      }
    } else {
      // Mock fallback
      res.json({ deliveryFee: mockDeliveryFee });
    }
  });

  // GET /api/products - Fetch products
  app.get("/api/products", async (req, res) => {
    if (supabase) {
      try {
        const { data, error } = await supabase.from("products").select("*");
        if (error) throw error;
        // Transform data if needed or return directly
        // Fallback to mock data if empty
        if (!data || data.length === 0) {
           return res.json(mockProducts);
        }
        return res.json(data);
      } catch (err: any) {
        console.warn("Supabase request failed. Using mock data. Please verify your Supabase URL/Key and ensure schema.sql is executed.");
        return res.json(mockProducts);
      }
    } else {
      res.json(mockProducts);
    }
  });

  // POST /api/orders - Submit an order
  app.post("/api/orders", async (req, res) => {
    const { customerName, customerPhone, customerEmail, city, district, items, subtotal, tax, deliveryFee, total } = req.body;

    if (!customerName || !city || !district || !items || items.length === 0) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    if (supabase) {
      try {
        // 1. Driver Assignment Logic
        let driverId = null;
        
        // Find driver by district and city
        const { data: driversByDistrict, error: errDistrict } = await supabase
          .from("drivers")
          .select("id")
          .eq("assigned_city", city)
          .eq("assigned_district", district)
          .limit(1);

        if (driversByDistrict && driversByDistrict.length > 0) {
          driverId = driversByDistrict[0].id;
        } else {
          // Find driver by city only (fallback)
          const { data: driversByCity } = await supabase
            .from("drivers")
            .select("id")
            .eq("assigned_city", city)
            .is("assigned_district", null)
            .limit(1);
            
          if (driversByCity && driversByCity.length > 0) {
            driverId = driversByCity[0].id;
          }
        }

        // 2. Create Order
        const { data: newOrder, error: orderError } = await supabase
          .from("orders")
          .insert({
            customer_name: customerName,
            customer_phone: customerPhone,
            customer_email: customerEmail,
            city,
            district,
            subtotal,
            tax,
            delivery_fee: deliveryFee,
            total,
            driver_id: driverId
          })
          .select()
          .single();

        if (orderError) throw orderError;

        // 3. Create Order Items
        const orderItemsToInsert = items.map((item: any) => ({
          order_id: newOrder.id,
          product_id: item.id.length === 36 ? item.id : null, // Assuming UUID format or fallback for mock ID
          product_name: item.name,
          quantity: item.quantity,
          price: item.price
        }));

        const { error: itemsError } = await supabase
          .from("order_items")
          .insert(orderItemsToInsert);

        if (itemsError) throw itemsError;

        return res.json({ success: true, orderId: newOrder.id, driverAssigned: !!driverId });

      } catch (err: any) {
        console.warn("Supabase request failed. Using mock data for order creation. Please verify your Supabase URL/Key and ensure schema.sql is executed.");
        const driver = mockDrivers.find(d => d.assigned_city === city && (d.assigned_district === district || !d.assigned_district));
        const newOrder = {
          id: Math.random().toString(36).substring(7),
          customerName, customerPhone, customerEmail, city, district, subtotal, tax, deliveryFee, total,
          driver_id: driver ? driver.id : null,
          items
        };
        mockOrders.push(newOrder);
        return res.json({ success: true, orderId: newOrder.id, driverAssigned: !!driver, mock: true });
      }
    } else {
      // Mock logic
      const driver = mockDrivers.find(d => d.assigned_city === city && (d.assigned_district === district || !d.assigned_district));
      const newOrder = {
        id: Math.random().toString(36).substring(7),
        customerName, customerPhone, customerEmail, city, district, subtotal, tax, deliveryFee, total,
        driver_id: driver ? driver.id : null,
        items
      };
      mockOrders.push(newOrder);
      res.json({ success: true, orderId: newOrder.id, driverAssigned: !!driver, mock: true });
    }
  });


  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
