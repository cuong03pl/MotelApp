/**
 * List of Vietnamese provinces, cities, and common variations
 */
const PROVINCES = {
  // Major cities
  "Hà Nội": ["Ha Noi", "Hanoi", "HN", "Thành phố Hà Nội", "TP Hà Nội", "TP. Hà Nội"],
  "Hồ Chí Minh": ["Ho Chi Minh", "HCM", "TP HCM", "TP. HCM", "Tp Hồ Chí Minh", "Tp. Hồ Chí Minh", "Thành phố Hồ Chí Minh", "Sài Gòn", "Saigon", "TPHCM"],
  "Đà Nẵng": ["Da Nang", "TP Đà Nẵng", "TP. Đà Nẵng", "Thành phố Đà Nẵng"],
  "Hải Phòng": ["Hai Phong", "TP Hải Phòng", "TP. Hải Phòng", "Thành phố Hải Phòng"],
  "Cần Thơ": ["Can Tho", "TP Cần Thơ", "TP. Cần Thơ", "Thành phố Cần Thơ"],
  
  // Other provinces
  "An Giang": ["Tỉnh An Giang"],
  "Bà Rịa - Vũng Tàu": ["Ba Ria Vung Tau", "Bà Rịa Vũng Tàu", "Vũng Tàu", "Vung Tau", "Tỉnh Bà Rịa - Vũng Tàu"],
  "Bắc Giang": ["Bac Giang", "Tỉnh Bắc Giang"],
  "Bắc Kạn": ["Bac Kan", "Tỉnh Bắc Kạn"],
  "Bạc Liêu": ["Bac Lieu", "Tỉnh Bạc Liêu"],
  "Bắc Ninh": ["Bac Ninh", "Tỉnh Bắc Ninh"],
  "Bến Tre": ["Ben Tre", "Tỉnh Bến Tre"],
  "Bình Định": ["Binh Dinh", "Tỉnh Bình Định"],
  "Bình Dương": ["Binh Duong", "Tỉnh Bình Dương"],
  "Bình Phước": ["Binh Phuoc", "Tỉnh Bình Phước"],
  "Bình Thuận": ["Binh Thuan", "Tỉnh Bình Thuận"],
  "Cà Mau": ["Ca Mau", "Tỉnh Cà Mau"],
  "Cao Bằng": ["Cao Bang", "Tỉnh Cao Bằng"],
  "Đắk Lắk": ["Dak Lak", "Đăk Lăk", "Tỉnh Đắk Lắk"],
  "Đắk Nông": ["Dak Nong", "Đăk Nông", "Tỉnh Đắk Nông"],
  "Điện Biên": ["Dien Bien", "Tỉnh Điện Biên"],
  "Đồng Nai": ["Dong Nai", "Tỉnh Đồng Nai"],
  "Đồng Tháp": ["Dong Thap", "Tỉnh Đồng Tháp"],
  "Gia Lai": ["Tỉnh Gia Lai"],
  "Hà Giang": ["Ha Giang", "Tỉnh Hà Giang"],
  "Hà Nam": ["Ha Nam", "Tỉnh Hà Nam"],
  "Hà Tĩnh": ["Ha Tinh", "Tỉnh Hà Tĩnh"],
  "Hải Dương": ["Hai Duong", "Tỉnh Hải Dương"],
  "Hậu Giang": ["Hau Giang", "Tỉnh Hậu Giang"],
  "Hòa Bình": ["Hoa Binh", "Tỉnh Hòa Bình"],
  "Hưng Yên": ["Hung Yen", "Tỉnh Hưng Yên"],
  "Khánh Hòa": ["Khanh Hoa", "Nha Trang", "Tỉnh Khánh Hòa"],
  "Kiên Giang": ["Kien Giang", "Phú Quốc", "Phu Quoc", "Tỉnh Kiên Giang"],
  "Kon Tum": ["Tỉnh Kon Tum"],
  "Lai Châu": ["Lai Chau", "Tỉnh Lai Châu"],
  "Lâm Đồng": ["Lam Dong", "Đà Lạt", "Da Lat", "Dalat", "Tỉnh Lâm Đồng"],
  "Lạng Sơn": ["Lang Son", "Tỉnh Lạng Sơn"],
  "Lào Cai": ["Lao Cai", "Sapa", "Sa Pa", "Tỉnh Lào Cai"],
  "Long An": ["Tỉnh Long An"],
  "Nam Định": ["Nam Dinh", "Tỉnh Nam Định"],
  "Nghệ An": ["Nghe An", "Tỉnh Nghệ An"],
  "Ninh Bình": ["Ninh Binh", "Tỉnh Ninh Bình"],
  "Ninh Thuận": ["Ninh Thuan", "Tỉnh Ninh Thuận"],
  "Phú Thọ": ["Phu Tho", "Tỉnh Phú Thọ"],
  "Phú Yên": ["Phu Yen", "Tỉnh Phú Yên"],
  "Quảng Bình": ["Quang Binh", "Tỉnh Quảng Bình"],
  "Quảng Nam": ["Quang Nam", "Hội An", "Hoi An", "Tỉnh Quảng Nam"],
  "Quảng Ngãi": ["Quang Ngai", "Tỉnh Quảng Ngãi"],
  "Quảng Ninh": ["Quang Ninh", "Hạ Long", "Ha Long", "Tỉnh Quảng Ninh"],
  "Quảng Trị": ["Quang Tri", "Tỉnh Quảng Trị"],
  "Sóc Trăng": ["Soc Trang", "Tỉnh Sóc Trăng"],
  "Sơn La": ["Son La", "Tỉnh Sơn La"],
  "Tây Ninh": ["Tay Ninh", "Tỉnh Tây Ninh"],
  "Thái Bình": ["Thai Binh", "Tỉnh Thái Bình"],
  "Thái Nguyên": ["Thai Nguyen", "Tỉnh Thái Nguyên"],
  "Thanh Hóa": ["Thanh Hoa", "Tỉnh Thanh Hóa"],
  "Thừa Thiên Huế": ["Thua Thien Hue", "Huế", "Hue", "Tỉnh Thừa Thiên Huế"],
  "Tiền Giang": ["Tien Giang", "Tỉnh Tiền Giang"],
  "Trà Vinh": ["Tra Vinh", "Tỉnh Trà Vinh"],
  "Tuyên Quang": ["Tuyen Quang", "Tỉnh Tuyên Quang"],
  "Vĩnh Long": ["Vinh Long", "Tỉnh Vĩnh Long"],
  "Vĩnh Phúc": ["Vinh Phuc", "Tỉnh Vĩnh Phúc"],
  "Yên Bái": ["Yen Bai", "Tỉnh Yên Bái"]
};

// Danh sách các quận/huyện và biến thể
const DISTRICTS = {
  // Hà Nội
  "Ba Đình": ["Ba Dinh", "Quận Ba Đình"],
  "Hoàn Kiếm": ["Hoan Kiem", "Quận Hoàn Kiếm"],
  "Hai Bà Trưng": ["Hai Ba Trung", "Quận Hai Bà Trưng"],
  "Đống Đa": ["Dong Da", "Quận Đống Đa"],
  "Tây Hồ": ["Tay Ho", "Quận Tây Hồ"],
  "Cầu Giấy": ["Cau Giay", "Quận Cầu Giấy"],
  "Thanh Xuân": ["Thanh Xuan", "Quận Thanh Xuân"],
  "Hoàng Mai": ["Hoang Mai", "Quận Hoàng Mai"],
  "Long Biên": ["Long Bien", "Quận Long Biên"],
  "Nam Từ Liêm": ["Nam Tu Liem", "Quận Nam Từ Liêm"],
  "Bắc Từ Liêm": ["Bac Tu Liem", "Quận Bắc Từ Liêm"],
  "Hà Đông": ["Ha Dong", "Quận Hà Đông"],
  
  // Hồ Chí Minh
  "Quận 1": ["District 1", "Q1", "Q.1", "Quận 1"],
  "Quận 2": ["District 2", "Q2", "Q.2", "Quận 2", "Thủ Đức"],
  "Quận 3": ["District 3", "Q3", "Q.3", "Quận 3"],
  "Quận 4": ["District 4", "Q4", "Q.4", "Quận 4"],
  "Quận 5": ["District 5", "Q5", "Q.5", "Quận 5"],
  "Quận 6": ["District 6", "Q6", "Q.6", "Quận 6"],
  "Quận 7": ["District 7", "Q7", "Q.7", "Quận 7"],
  "Quận 8": ["District 8", "Q8", "Q.8", "Quận 8"],
  "Quận 9": ["District 9", "Q9", "Q.9", "Quận 9"],
  "Quận 10": ["District 10", "Q10", "Q.10", "Quận 10"],
  "Quận 11": ["District 11", "Q11", "Q.11", "Quận 11"],
  "Quận 12": ["District 12", "Q12", "Q.12", "Quận 12"],
  "Tân Bình": ["Tan Binh", "Quận Tân Bình"],
  "Bình Tân": ["Binh Tan", "Quận Bình Tân"],
  "Tân Phú": ["Tan Phu", "Quận Tân Phú"],
  "Phú Nhuận": ["Phu Nhuan", "Quận Phú Nhuận"],
  "Gò Vấp": ["Go Vap", "Quận Gò Vấp"],
  "Bình Thạnh": ["Binh Thanh", "Quận Bình Thạnh"],
  "Thủ Đức": ["Thu Duc", "Quận Thủ Đức", "TP Thủ Đức", "Thành phố Thủ Đức"],
};

export const getProvinceFromAddress = (address) => {
  if (!address || typeof address !== 'string') {
    return null;
  }
  const normalizedAddress = address.toLowerCase();
  
  for (const [province, variations] of Object.entries(PROVINCES)) {
    if (normalizedAddress.includes(province.toLowerCase())) {
      return province;
    }
    for (const variation of variations) {
      if (normalizedAddress.includes(variation.toLowerCase())) {
        return province;
      }
    }
  }

  return null;
};


export const getLastPartOfAddress = (address) => {
  if (!address || typeof address !== 'string') {
    return null;
  }

  const parts = address.split(/[,\-•]/);
  
  const lastPart = parts
    .map(part => part.trim())
    .filter(part => part.length > 0)
    .pop();
    
  return lastPart || null;
};

/**
 * Extracts district name from an address string
 * @param {string} address - The full address string
 * @returns {string|null} - The extracted district name or null if not found
 */
export const getDistrictFromAddress = (address) => {
  if (!address || typeof address !== 'string') {
    return null;
  }
  const normalizedAddress = address.toLowerCase();
  
  for (const [district, variations] of Object.entries(DISTRICTS)) {
    if (normalizedAddress.includes(district.toLowerCase())) {
      return district;
    }
    for (const variation of variations) {
      if (normalizedAddress.includes(variation.toLowerCase())) {
        return district;
      }
    }
  }

  // Lookup for "Quận X" pattern in address
  const quanPattern = /quận\s+([^\s,]+)/i;
  const match = address.match(quanPattern);
  if (match && match[1]) {
    return `Quận ${match[1]}`;
  }

  return null;
};

export const getProvince = (address) => {
  // Trích xuất quận/huyện
  const district = getDistrictFromAddress(address);
  if (district) {
    return district;
  }
  
  // Tiếp tục với logic lấy tên tỉnh như trước
  const exactMatch = getProvinceFromAddress(address);
  if (exactMatch) {
    return exactMatch;
  }
  const lastPart = getLastPartOfAddress(address);
  if (lastPart) {
    const lastPartMatch = getProvinceFromAddress(lastPart);
    if (lastPartMatch) {
      return lastPartMatch;
    }
    if (lastPart.includes("TP") || 
        lastPart.includes("Thành phố") || 
        lastPart.includes("Tỉnh")) {
      return lastPart;
    }
  }
  
  return lastPart;
};

export default getProvince;
