-- INNOVEXA TECHNOLOGIES: Realistic Sample Seed Data
-- File: supabase/seed.sql

-- Helper function to seed sample data for any authenticated user
CREATE OR REPLACE FUNCTION public.seed_demo_data_for_user(target_user_id UUID)
RETURNS void AS $$
DECLARE
    cat_elec UUID;
    cat_furn UUID;
    cat_acc UUID;
    cat_home UUID;
    cat_ind UUID;
    prod_id UUID;
BEGIN
    -- 1. Insert Categories
    INSERT INTO public.categories (id, user_id, name, description)
    VALUES 
        (gen_random_uuid(), target_user_id, 'Electronics', 'Consumer electronics, accessories, smart devices and audio equipment'),
        (gen_random_uuid(), target_user_id, 'Furniture', 'Ergonomic office furniture, desks, seating and studio storage'),
        (gen_random_uuid(), target_user_id, 'Accessories', 'Bags, leather sleeves, protective gear and desk organizers'),
        (gen_random_uuid(), target_user_id, 'Home & Living', 'Ambient lighting, planters, minimalist kitchenware and decor'),
        (gen_random_uuid(), target_user_id, 'Industrial Supplies', 'Packaging supplies, precision instruments and workshop tools')
    ON CONFLICT (user_id, name) DO NOTHING;

    SELECT id INTO cat_elec FROM public.categories WHERE user_id = target_user_id AND name = 'Electronics' LIMIT 1;
    SELECT id INTO cat_furn FROM public.categories WHERE user_id = target_user_id AND name = 'Furniture' LIMIT 1;
    SELECT id INTO cat_acc  FROM public.categories WHERE user_id = target_user_id AND name = 'Accessories' LIMIT 1;
    SELECT id INTO cat_home FROM public.categories WHERE user_id = target_user_id AND name = 'Home & Living' LIMIT 1;
    SELECT id INTO cat_ind  FROM public.categories WHERE user_id = target_user_id AND name = 'Industrial Supplies' LIMIT 1;

    -- 2. Insert 20 Diverse, Realistic Products
    -- Product 1: Listed, Healthy Stock (Electronics)
    INSERT INTO public.products (
        user_id, created_by, product_name, sku, category_id,
        purchase_cost, selling_price, currency,
        weight_value, weight_unit, length, width, height, dimension_unit,
        material, colour, size,
        description, keywords, image_url, drive_url,
        hsn_code, gst_percentage, stock_quantity, low_stock_threshold,
        status, internal_notes
    ) VALUES (
        target_user_id, target_user_id, 'Aura ANC Wireless Studio Headphones', 'ELEC-HDPH-001', cat_elec,
        4200.00, 7999.00, 'INR',
        280.00, 'g', 18.5, 16.0, 8.2, 'cm',
        'Matte Aluminum & Memory Foam', 'Midnight Black', 'Universal Over-Ear',
        'Audiophile-grade active noise cancelling wireless headphones with 40mm neodymium drivers and 36-hour battery life.',
        'anc headphones, wireless bluetooth, studio audio, over ear headphones',
        'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=80',
        'https://drive.google.com/drive/folders/innovexa-demo-001',
        '85183000', 18.00, 48, 10,
        'Listed', 'Bestseller. Regular production cycle in Bengaluru warehouse.'
    ) ON CONFLICT (user_id, sku) DO NOTHING;

    -- Product 2: Low Stock Warning (Electronics)
    INSERT INTO public.products (
        user_id, created_by, product_name, sku, category_id,
        purchase_cost, selling_price, currency,
        weight_value, weight_unit, length, width, height, dimension_unit,
        material, colour, size,
        description, keywords, image_url, drive_url,
        hsn_code, gst_percentage, stock_quantity, low_stock_threshold,
        status, internal_notes
    ) VALUES (
        target_user_id, target_user_id, 'Apex 65W GaN Fast Charger Trio', 'ELEC-CHG-002', cat_elec,
        850.00, 1899.00, 'INR',
        115.00, 'g', 6.0, 4.5, 3.2, 'cm',
        'Flame-retardant Polycarbonate', 'Glacier White', 'Compact 3-Port',
        'Ultra-compact 65W Gallium Nitride charger with 2x USB-C and 1x USB-A ports supporting PD 3.0 and PPS.',
        'gan charger, 65w fast charger, usb-c pd, laptop charger',
        'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=600&auto=format&fit=crop&q=80',
        'https://drive.google.com/drive/folders/innovexa-demo-002',
        '85044090', 18.00, 4, 15,
        'Listed', 'Stock running critically low. Reorder placed with supplier.'
    ) ON CONFLICT (user_id, sku) DO NOTHING;

    -- Product 3: Out of Stock (Electronics)
    INSERT INTO public.products (
        user_id, created_by, product_name, sku, category_id,
        purchase_cost, selling_price, currency,
        weight_value, weight_unit, length, width, height, dimension_unit,
        material, colour, size,
        description, keywords, image_url, drive_url,
        hsn_code, gst_percentage, stock_quantity, low_stock_threshold,
        status, internal_notes
    ) VALUES (
        target_user_id, target_user_id, 'ProTrack Magnetic Wireless Powerbank 10000mAh', 'ELEC-PWR-003', cat_elec,
        1100.00, 2499.00, 'INR',
        210.00, 'g', 10.4, 6.8, 1.5, 'cm',
        'Anodized Aluminum & Soft Silicone', 'Graphite Gray', '10000 mAh',
        'MagSafe-compatible 15W wireless powerbank with 20W wired USB-C output and kickstand.',
        'magsafe powerbank, wireless portable battery, fast charging',
        'https://images.unsplash.com/photo-1609592426868-b3bfbe28a68a?w=600&auto=format&fit=crop&q=80',
        'https://drive.google.com/drive/folders/innovexa-demo-003',
        '85044090', 18.00, 0, 10,
        'Ready for Listing', 'Currently out of stock. Shipment arriving next Monday.'
    ) ON CONFLICT (user_id, sku) DO NOTHING;

    -- Product 4: Draft (Electronics)
    INSERT INTO public.products (
        user_id, created_by, product_name, sku, category_id,
        purchase_cost, selling_price, currency,
        weight_value, weight_unit, length, width, height, dimension_unit,
        material, colour, size,
        description, keywords, image_url, drive_url,
        hsn_code, gst_percentage, stock_quantity, low_stock_threshold,
        status, internal_notes
    ) VALUES (
        target_user_id, target_user_id, 'NovaStream 4K Ultra HD Webcam with Dual Mic', 'ELEC-CAM-004', cat_elec,
        2800.00, 5499.00, 'INR',
        185.00, 'g', 9.8, 3.5, 4.2, 'cm',
        'ABS & Optical Glass Lens', 'Carbon Black', 'Standard Clip',
        '4K UHD Sony sensor webcam with autofocus, built-in privacy shutter, and noise-canceling stereo microphones.',
        '4k webcam, streaming camera, conference call, usb video',
        'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=600&auto=format&fit=crop&q=80',
        'https://drive.google.com/drive/folders/innovexa-demo-004',
        '85258900', 18.00, 15, 5,
        'Draft', 'Pending compliance test certificate and product packaging photos.'
    ) ON CONFLICT (user_id, sku) DO NOTHING;

    -- Product 5: Listed (Furniture)
    INSERT INTO public.products (
        user_id, created_by, product_name, sku, category_id,
        purchase_cost, selling_price, currency,
        weight_value, weight_unit, length, width, height, dimension_unit,
        material, colour, size,
        description, keywords, image_url, drive_url,
        hsn_code, gst_percentage, stock_quantity, low_stock_threshold,
        status, internal_notes
    ) VALUES (
        target_user_id, target_user_id, 'ErgoFlex Pro Mesh Task Chair', 'FURN-CHR-001', cat_furn,
        8500.00, 16999.00, 'INR',
        16.50, 'kg', 65.0, 65.0, 115.0, 'cm',
        'Breathable Korean Mesh & Nylon Base', 'Slate Black', 'Adjustable Ergonomic',
        'High-back ergonomic task chair with 3D lumbar support, multi-tilt mechanism, and synchronized armrests.',
        'ergonomic chair, mesh office chair, work from home seating, lumbar support',
        'https://images.unsplash.com/photo-1580481077195-c228ff34a036?w=600&auto=format&fit=crop&q=80',
        'https://drive.google.com/drive/folders/innovexa-demo-005',
        '94013000', 18.00, 22, 5,
        'Listed', 'Top performer in B2B corporate work-from-home category.'
    ) ON CONFLICT (user_id, sku) DO NOTHING;

    -- Product 6: Ready for Listing (Furniture)
    INSERT INTO public.products (
        user_id, created_by, product_name, sku, category_id,
        purchase_cost, selling_price, currency,
        weight_value, weight_unit, length, width, height, dimension_unit,
        material, colour, size,
        description, keywords, image_url, drive_url,
        hsn_code, gst_percentage, stock_quantity, low_stock_threshold,
        status, internal_notes
    ) VALUES (
        target_user_id, target_user_id, 'Solitude Solid Teak Standing Desk 140x70', 'FURN-DSK-002', cat_furn,
        14000.00, 26999.00, 'INR',
        32.00, 'kg', 140.0, 70.0, 74.0, 'cm',
        'Solid Teakwood & Heavy-duty Steel Legs', 'Natural Walnut', '140 cm x 70 cm',
        'Dual-motor electric standing desk with memory keypad, anti-collision sensor, and integrated cable tray.',
        'standing desk, height adjustable, solid wood desk, home office',
        'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?w=600&auto=format&fit=crop&q=80',
        'https://drive.google.com/drive/folders/innovexa-demo-006',
        '94031000', 18.00, 8, 3,
        'Ready for Listing', 'Final pricing approved by leadership team.'
    ) ON CONFLICT (user_id, sku) DO NOTHING;

    -- Product 7: Low Stock (Furniture)
    INSERT INTO public.products (
        user_id, created_by, product_name, sku, category_id,
        purchase_cost, selling_price, currency,
        weight_value, weight_unit, length, width, height, dimension_unit,
        material, colour, size,
        description, keywords, image_url, drive_url,
        hsn_code, gst_percentage, stock_quantity, low_stock_threshold,
        status, internal_notes
    ) VALUES (
        target_user_id, target_user_id, 'Minimalist Beechwood Dual Monitor Riser', 'FURN-ACC-003', cat_furn,
        1200.00, 2799.00, 'INR',
        3.20, 'kg', 105.0, 22.0, 11.5, 'cm',
        'FSC-Certified Beech Ply & Cork Feet', 'Warm Beech', 'Dual Monitor (105cm)',
        'Heavy-duty solid ply monitor stand with dedicated felt storage shelf for keyboard and trackpad.',
        'monitor riser, desk shelf, monitor stand, dual screen desk',
        'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=600&auto=format&fit=crop&q=80',
        'https://drive.google.com/drive/folders/innovexa-demo-007',
        '94033090', 12.00, 3, 8,
        'Listed', 'Stock depleted quickly post festive sale.'
    ) ON CONFLICT (user_id, sku) DO NOTHING;

    -- Product 8: Listed (Accessories)
    INSERT INTO public.products (
        user_id, created_by, product_name, sku, category_id,
        purchase_cost, selling_price, currency,
        weight_value, weight_unit, length, width, height, dimension_unit,
        material, colour, size,
        description, keywords, image_url, drive_url,
        hsn_code, gst_percentage, stock_quantity, low_stock_threshold,
        status, internal_notes
    ) VALUES (
        target_user_id, target_user_id, 'Vanguard Full-Grain Leather 16-inch Laptop Sleeve', 'ACC-SLV-001', cat_acc,
        1400.00, 3299.00, 'INR',
        340.00, 'g', 38.0, 27.0, 1.8, 'cm',
        'Top Grain Buff Calfskin & Suede Lining', 'Cognac Tan', 'Fits 16-inch MacBook',
        'Handcrafted vegetable-tanned leather protective sleeve with magnetic closure and rear folio pocket.',
        'leather laptop sleeve, macbook sleeve 16 inch, designer folio, travel sleeve',
        'https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?w=600&auto=format&fit=crop&q=80',
        'https://drive.google.com/drive/folders/innovexa-demo-008',
        '42021110', 18.00, 35, 10,
        'Listed', 'Premium craftsmanship tier; high customer satisfaction.'
    ) ON CONFLICT (user_id, sku) DO NOTHING;

    -- Product 9: Listed (Accessories)
    INSERT INTO public.products (
        user_id, created_by, product_name, sku, category_id,
        purchase_cost, selling_price, currency,
        weight_value, weight_unit, length, width, height, dimension_unit,
        material, colour, size,
        description, keywords, image_url, drive_url,
        hsn_code, gst_percentage, stock_quantity, low_stock_threshold,
        status, internal_notes
    ) VALUES (
        target_user_id, target_user_id, 'Apex Everyday Tech Organizer Pouch', 'ACC-PCH-002', cat_acc,
        650.00, 1499.00, 'INR',
        190.00, 'g', 24.0, 14.0, 7.5, 'cm',
        'Cordura 840D Weatherproof Ballistic Nylon', 'Obsidian Black', 'Medium 2.5L',
        'Origami-style accordion organizer pouch with elastic loops, zip pockets, and weatherproof YKK zippers.',
        'tech pouch, cable organizer, travel accessories case, cord storage',
        'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&auto=format&fit=crop&q=80',
        'https://drive.google.com/drive/folders/innovexa-demo-009',
        '42029200', 18.00, 52, 12,
        'Listed', 'High margin accessory bundle with laptop sleeves.'
    ) ON CONFLICT (user_id, sku) DO NOTHING;

    -- Product 10: Archived (Accessories)
    INSERT INTO public.products (
        user_id, created_by, product_name, sku, category_id,
        purchase_cost, selling_price, currency,
        weight_value, weight_unit, length, width, height, dimension_unit,
        material, colour, size,
        description, keywords, image_url, drive_url,
        hsn_code, gst_percentage, stock_quantity, low_stock_threshold,
        status, internal_notes, archived_at
    ) VALUES (
        target_user_id, target_user_id, 'Vintage Canvas Travel Duffle 45L (Legacy)', 'ACC-BAG-003', cat_acc,
        1800.00, 3999.00, 'INR',
        1.40, 'kg', 55.0, 30.0, 28.0, 'cm',
        'Waxed Cotton Canvas & Brass Hardware', 'Olive Drab', '45 Litres',
        'Discontinued classic weekender duffle bag with brass zippers and detachable shoulder strap.',
        'canvas duffle, weekend bag, travel luggage, legacy line',
        'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&auto=format&fit=crop&q=80',
        'https://drive.google.com/drive/folders/innovexa-demo-010',
        '42021220', 18.00, 0, 5,
        'Archived', 'Discontinued legacy model replaced by Apex Series.', timezone('utc'::text, now()) - interval '14 days'
    ) ON CONFLICT (user_id, sku) DO NOTHING;

    -- Product 11: Listed (Home & Living)
    INSERT INTO public.products (
        user_id, created_by, product_name, sku, category_id,
        purchase_cost, selling_price, currency,
        weight_value, weight_unit, length, width, height, dimension_unit,
        material, colour, size,
        description, keywords, image_url, drive_url,
        hsn_code, gst_percentage, stock_quantity, low_stock_threshold,
        status, internal_notes
    ) VALUES (
        target_user_id, target_user_id, 'Lumina Smart Ambient RGBW Light Bar', 'HOME-LGT-001', cat_home,
        950.00, 2199.00, 'INR',
        380.00, 'g', 35.0, 5.0, 4.0, 'cm',
        'Aircraft Aluminum & Frosted Polycarbonate', 'Matte Silver', '35cm Bar',
        'Screen bar with auto-dimming ambient light sensor, wireless remote puck, and 16 million RGB backlighting.',
        'light bar, desk lamp, screen monitor light, ambient backlight',
        'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=600&auto=format&fit=crop&q=80',
        'https://drive.google.com/drive/folders/innovexa-demo-011',
        '94052090', 18.00, 64, 15,
        'Listed', 'Best companion item for standing desk setups.'
    ) ON CONFLICT (user_id, sku) DO NOTHING;

    -- Product 12: Ready for Listing (Home & Living)
    INSERT INTO public.products (
        user_id, created_by, product_name, sku, category_id,
        purchase_cost, selling_price, currency,
        weight_value, weight_unit, length, width, height, dimension_unit,
        material, colour, size,
        description, keywords, image_url, drive_url,
        hsn_code, gst_percentage, stock_quantity, low_stock_threshold,
        status, internal_notes
    ) VALUES (
        target_user_id, target_user_id, 'Nordic Ceramic Acoustic Diffuser & Planter', 'HOME-DEC-002', cat_home,
        450.00, 1199.00, 'INR',
        820.00, 'g', 14.0, 14.0, 16.0, 'cm',
        'Glazed Matte Ceramic', 'Sand Dune Off-White', 'Medium 14cm',
        'Dual-purpose desktop acoustic geometry planter with drainage saucer and natural ultrasonic scent stone.',
        'ceramic planter, desk decor, acoustic diffuser, minimalist pot',
        'https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=600&auto=format&fit=crop&q=80',
        'https://drive.google.com/drive/folders/innovexa-demo-012',
        '69139000', 12.00, 18, 5,
        'Ready for Listing', 'Listing images finalized, waiting for marketing release schedule.'
    ) ON CONFLICT (user_id, sku) DO NOTHING;

    -- Product 13: Low Stock (Home & Living)
    INSERT INTO public.products (
        user_id, created_by, product_name, sku, category_id,
        purchase_cost, selling_price, currency,
        weight_value, weight_unit, length, width, height, dimension_unit,
        material, colour, size,
        description, keywords, image_url, drive_url,
        hsn_code, gst_percentage, stock_quantity, low_stock_threshold,
        status, internal_notes
    ) VALUES (
        target_user_id, target_user_id, 'Artisan Hand-Carved Teak Coaster Set of 6', 'HOME-DEC-003', cat_home,
        280.00, 699.00, 'INR',
        310.00, 'g', 10.0, 10.0, 4.5, 'cm',
        'Seasoned Teakwood & Brass Rim', 'Natural Teak', 'Set of 6',
        'Set of six water-sealed solid teak drink coasters with felt base and brass storage caddy.',
        'wood coasters, desk accessories, tea coasters set, handmade',
        'https://images.unsplash.com/photo-1616046229478-9901c5536a45?w=600&auto=format&fit=crop&q=80',
        'https://drive.google.com/drive/folders/innovexa-demo-013',
        '44199090', 12.00, 5, 10,
        'Listed', 'Stock low; supplier restock expected in 2 weeks.'
    ) ON CONFLICT (user_id, sku) DO NOTHING;

    -- Product 14: Listed (Industrial Supplies)
    INSERT INTO public.products (
        user_id, created_by, product_name, sku, category_id,
        purchase_cost, selling_price, currency,
        weight_value, weight_unit, length, width, height, dimension_unit,
        material, colour, size,
        description, keywords, image_url, drive_url,
        hsn_code, gst_percentage, stock_quantity, low_stock_threshold,
        status, internal_notes
    ) VALUES (
        target_user_id, target_user_id, 'Precision Digital Vernier Caliper 150mm Stainless', 'IND-TOL-001', cat_ind,
        780.00, 1650.00, 'INR',
        320.00, 'g', 24.5, 9.0, 3.0, 'cm',
        'Hardened Stainless Steel', 'Polished Chrome', '150mm / 6 inch',
        'High precision digital caliper measuring inside, outside, depth and step with 0.01mm resolution and LCD readout.',
        'vernier caliper, precision measuring tool, digital micrometer, workshop tools',
        'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=600&auto=format&fit=crop&q=80',
        'https://drive.google.com/drive/folders/innovexa-demo-014',
        '90173010', 18.00, 42, 8,
        'Listed', 'Industrial QC tool. High repeat order rate from fab labs.'
    ) ON CONFLICT (user_id, sku) DO NOTHING;

    -- Product 15: Out of Stock (Industrial Supplies)
    INSERT INTO public.products (
        user_id, created_by, product_name, sku, category_id,
        purchase_cost, selling_price, currency,
        weight_value, weight_unit, length, width, height, dimension_unit,
        material, colour, size,
        description, keywords, image_url, drive_url,
        hsn_code, gst_percentage, stock_quantity, low_stock_threshold,
        status, internal_notes
    ) VALUES (
        target_user_id, target_user_id, 'ProSeal Heavy Duty Box Sealing Tape Dispenser 3-inch', 'IND-PKG-002', cat_ind,
        320.00, 750.00, 'INR',
        520.00, 'g', 26.0, 16.0, 8.5, 'cm',
        'Structural Steel & Comfort Rubber Grip', 'Industrial Orange', '3-inch Core',
        'Industrial grade tape gun with anti-reversing mechanism, adjustable tension brake, and retractable safety blade.',
        'tape dispenser, packaging gun, packing tool, warehouse tape cutter',
        'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=600&auto=format&fit=crop&q=80',
        'https://drive.google.com/drive/folders/innovexa-demo-015',
        '84223000', 18.00, 0, 12,
        'Ready for Listing', 'Warehouse ran out of stock; supplier dispatching batch tomorrow.'
    ) ON CONFLICT (user_id, sku) DO NOTHING;

    -- Product 16: Draft (Industrial Supplies)
    INSERT INTO public.products (
        user_id, created_by, product_name, sku, category_id,
        purchase_cost, selling_price, currency,
        weight_value, weight_unit, length, width, height, dimension_unit,
        material, colour, size,
        description, keywords, image_url, drive_url,
        hsn_code, gst_percentage, stock_quantity, low_stock_threshold,
        status, internal_notes
    ) VALUES (
        target_user_id, target_user_id, 'Anti-Static ESD Wrist Strap & Grounding Mat Kit', 'IND-ESD-003', cat_ind,
        410.00, 899.00, 'INR',
        450.00, 'g', 60.0, 40.0, 0.2, 'cm',
        'Conductive Rubber & Copper Grounding Cable', 'Sky Blue', '60cm x 40cm Mat',
        'Professional static dissipation mat with grounding cord and adjustable elastic ESD wrist strap.',
        'anti static mat, esd strap, electronics repair kit, grounding wire',
        'https://images.unsplash.com/photo-1581092335397-9583fe92d232?w=600&auto=format&fit=crop&q=80',
        'https://drive.google.com/drive/folders/innovexa-demo-016',
        '85444299', 18.00, 25, 5,
        'Draft', 'Verifying compliance certifications for commercial marketplace listing.'
    ) ON CONFLICT (user_id, sku) DO NOTHING;

    -- Product 17: Listed (Electronics)
    INSERT INTO public.products (
        user_id, created_by, product_name, sku, category_id,
        purchase_cost, selling_price, currency,
        weight_value, weight_unit, length, width, height, dimension_unit,
        material, colour, size,
        description, keywords, image_url, drive_url,
        hsn_code, gst_percentage, stock_quantity, low_stock_threshold,
        status, internal_notes
    ) VALUES (
        target_user_id, target_user_id, 'SwiftType Compact 75% Mechanical Keyboard', 'ELEC-KBD-005', cat_elec,
        3400.00, 6499.00, 'INR',
        860.00, 'g', 31.5, 12.5, 3.8, 'cm',
        'CNC Aluminum Frame & PBT Keycaps', 'Smoke Gray & Teal', '75% Layout (84 Keys)',
        'Hot-swappable tactile mechanical keyboard with Bluetooth 5.1, 2.4GHz wireless, RGB backlight and 4000mAh battery.',
        'mechanical keyboard, hot swappable, wireless typing, 75 percent keyboard',
        'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=600&auto=format&fit=crop&q=80',
        'https://drive.google.com/drive/folders/innovexa-demo-017',
        '84716040', 18.00, 31, 8,
        'Listed', 'High review score; trending among developers.'
    ) ON CONFLICT (user_id, sku) DO NOTHING;

    -- Product 18: Listed (Accessories)
    INSERT INTO public.products (
        user_id, created_by, product_name, sku, category_id,
        purchase_cost, selling_price, currency,
        weight_value, weight_unit, length, width, height, dimension_unit,
        material, colour, size,
        description, keywords, image_url, drive_url,
        hsn_code, gst_percentage, stock_quantity, low_stock_threshold,
        status, internal_notes
    ) VALUES (
        target_user_id, target_user_id, 'Orbit Magnetic Cable Management Desktop Hub', 'ACC-ORG-004', cat_acc,
        390.00, 899.00, 'INR',
        140.00, 'g', 9.0, 2.5, 1.8, 'cm',
        'Weighted Zinc Alloy & Silicone Collars', 'Space Gray', '3 Cable Clips',
        'Weighted metal base with 3 strong magnetic cable collars to keep charging cords anchored neatly on your desk.',
        'cable organizer, magnetic cable holder, cord management, desk tidy',
        'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&auto=format&fit=crop&q=80',
        'https://drive.google.com/drive/folders/innovexa-demo-018',
        '39269099', 18.00, 75, 15,
        'Listed', 'Steady daily sales on all connected marketplaces.'
    ) ON CONFLICT (user_id, sku) DO NOTHING;

    -- Product 19: Low Stock (Furniture)
    INSERT INTO public.products (
        user_id, created_by, product_name, sku, category_id,
        purchase_cost, selling_price, currency,
        weight_value, weight_unit, length, width, height, dimension_unit,
        material, colour, size,
        description, keywords, image_url, drive_url,
        hsn_code, gst_percentage, stock_quantity, low_stock_threshold,
        status, internal_notes
    ) VALUES (
        target_user_id, target_user_id, 'AeroSteel Adjustable Heavy Duty Monitor Arm', 'FURN-ARM-004', cat_furn,
        2100.00, 4499.00, 'INR',
        2.85, 'kg', 45.0, 12.0, 10.0, 'cm',
        'Die-cast Aluminum & Gas Spring', 'Matte Black', 'Single Arm (Up to 34")',
        'Counterbalance gas spring monitor arm supporting up to 9kg with integrated cable channels and USB passthrough.',
        'monitor arm, gas spring desk mount, vesa stand, screen arm',
        'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=600&auto=format&fit=crop&q=80',
        'https://drive.google.com/drive/folders/innovexa-demo-019',
        '83024200', 18.00, 2, 6,
        'Listed', 'Only 2 units left in stock. Reorder notification triggered.'
    ) ON CONFLICT (user_id, sku) DO NOTHING;

    -- Product 20: Archived (Electronics)
    INSERT INTO public.products (
        user_id, created_by, product_name, sku, category_id,
        purchase_cost, selling_price, currency,
        weight_value, weight_unit, length, width, height, dimension_unit,
        material, colour, size,
        description, keywords, image_url, drive_url,
        hsn_code, gst_percentage, stock_quantity, low_stock_threshold,
        status, internal_notes, archived_at
    ) VALUES (
        target_user_id, target_user_id, 'EchoLink Bluetooth 4.2 Audio Transmitter (Gen 1)', 'ELEC-AUD-006', cat_elec,
        500.00, 1199.00, 'INR',
        45.00, 'g', 5.0, 3.5, 1.2, 'cm',
        'ABS Plastic', 'Matte Black', 'Pocket Size',
        'First generation 3.5mm jack to Bluetooth 4.2 transmitter. Discontinued in favor of Gen 2 LE Audio model.',
        'bluetooth transmitter, audio adapter, legacy audio',
        'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=600&auto=format&fit=crop&q=80',
        'https://drive.google.com/drive/folders/innovexa-demo-020',
        '85176290', 18.00, 0, 5,
        'Archived', 'Legacy generation phased out permanently.', timezone('utc'::text, now()) - interval '30 days'
    ) ON CONFLICT (user_id, sku) DO NOTHING;

    -- 3. Insert Activity Logs
    INSERT INTO public.activity_logs (user_id, action, description, created_at)
    VALUES
        (target_user_id, 'IMPORT', 'Batch imported 20 catalog records for Innovexa launch', timezone('utc'::text, now()) - interval '2 days'),
        (target_user_id, 'CREATE', 'Created product "Aura ANC Wireless Studio Headphones" (SKU: ELEC-HDPH-001)', timezone('utc'::text, now()) - interval '1 day'),
        (target_user_id, 'UPDATE', 'Updated selling price for "ErgoFlex Pro Mesh Task Chair" to ₹16,999.00', timezone('utc'::text, now()) - interval '18 hours'),
        (target_user_id, 'STOCK_ADJUSTMENT', 'Adjusted stock for "Apex 65W GaN Fast Charger Trio" from 10 to 4 (Sale order dispatch)', timezone('utc'::text, now()) - interval '6 hours'),
        (target_user_id, 'ARCHIVE', 'Archived legacy product "EchoLink Bluetooth 4.2 Audio Transmitter"', timezone('utc'::text, now()) - interval '2 hours');

END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

