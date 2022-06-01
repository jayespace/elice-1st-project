// 스토리지
export const store = {
  setLocalStorage(cart) {
    localStorage.setItem('cart', JSON.stringify(cart));
  },
  getLocalStorage() {
    return JSON.parse(localStorage.getItem('cart'));
  },
};
