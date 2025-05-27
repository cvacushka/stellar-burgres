import Cypress from 'cypress';

const API_ENDPOINT = 'https://norma.nomoreparties.space/api';
const QUANTUM_BUN_SELECTOR = `[data-cy=${'643d69a5c3f7b9001cfa093c'}]`;
const STELLAR_BUN_SELECTOR = `[data-cy=${'643d69a5c3f7b9001cfa093d'}]`;
const COSMIC_FILLING_SELECTOR = `[data-cy=${'643d69a5c3f7b9001cfa0941'}]`;

beforeEach(() => {
  cy.intercept('GET', `${API_ENDPOINT}/ingredients`, {
    fixture: 'ingredients.json'
  });
  cy.intercept('POST', `${API_ENDPOINT}/auth/login`, {
    fixture: 'user.json'
  });
  cy.intercept('GET', `${API_ENDPOINT}/auth/user`, {
    fixture: 'user.json'
  });
  cy.intercept('POST', `${API_ENDPOINT}/orders`, {
    fixture: 'orderResponse.json'
  });
  cy.visit('/');
  cy.viewport(1440, 800);
  cy.get('#modals').as('modalContainer');
});

describe('Галактическая сборка космического бургера', () => {
  it('увеличение счетчика компонентов', () => {
    cy.get(COSMIC_FILLING_SELECTOR).children('button').click();
    cy.get(COSMIC_FILLING_SELECTOR).find('.counter__num').contains('1');
  });
  
  describe('компоновка звездного бургера', () => {
    it('добавление квантовой булки и космической начинки', () => {
      cy.get(QUANTUM_BUN_SELECTOR).children('button').click();
      cy.get(COSMIC_FILLING_SELECTOR).children('button').click();
    });
    it('добавление булки после размещения начинок', () => {
      cy.get(COSMIC_FILLING_SELECTOR).children('button').click();
      cy.get(QUANTUM_BUN_SELECTOR).children('button').click();
    });
  });
  
  describe('квантовая замена булок', () => {
    it('замена булки при пустом списке начинок', () => {
      cy.get(QUANTUM_BUN_SELECTOR).children('button').click();
      cy.get(STELLAR_BUN_SELECTOR).children('button').click();
    });
    it('замена булки при наличии космических начинок', () => {
      cy.get(QUANTUM_BUN_SELECTOR).children('button').click();
      cy.get(COSMIC_FILLING_SELECTOR).children('button').click();
      cy.get(STELLAR_BUN_SELECTOR).children('button').click();
    });
  });
});

describe('оформление космического заказа', () => {
  beforeEach(() => {
    window.localStorage.setItem('refreshToken', 'stellar_refresh_abc');
    cy.setCookie('accessToken', 'quantum_token_xyz');
    cy.getAllLocalStorage().should('be.not.empty');
    cy.getCookie('accessToken').should('be.not.empty');
  });
  
  afterEach(() => {
    window.localStorage.clear();
    cy.clearAllCookies();
    cy.getAllLocalStorage().should('be.empty');
    cy.getAllCookies().should('be.empty');
  });

  it('отправка и верификация звездного заказа', () => {
    cy.get(QUANTUM_BUN_SELECTOR).children('button').click();
    cy.get(COSMIC_FILLING_SELECTOR).children('button').click();
    cy.get(`[data-cy='order-button']`).click();
    cy.get('@modalContainer').find('h2').contains('42187');
  });
});

describe('управление космическими порталами', () => {
  it('открытие и проверка данных в портале ингредиента', () => {
    cy.get('@modalContainer').should('be.empty');
    cy.get(COSMIC_FILLING_SELECTOR).children('a').click();
    cy.get('@modalContainer').should('be.not.empty');
    cy.url().should('include', '643d69a5c3f7b9001cfa0941');
  });
  
  it('закрытие портала кнопкой', () => {
    cy.get('@modalContainer').should('be.empty');
    cy.get(COSMIC_FILLING_SELECTOR).children('a').click();
    cy.get('@modalContainer').should('be.not.empty');
    cy.get('@modalContainer').find('button').click();
    cy.get('@modalContainer').should('be.empty');
  });
  
  it('закрытие портала через оверлей', () => {
    cy.get('@modalContainer').should('be.empty');
    cy.get(COSMIC_FILLING_SELECTOR).children('a').click();
    cy.get('@modalContainer').should('be.not.empty');
    cy.get(`[data-cy='overlay']`).click({ force: true });
    cy.get('@modalContainer').should('be.empty');
  });
  
  it('закрытие портала через телепорт (Escape)', () => {
    cy.get('@modalContainer').should('be.empty');
    cy.get(COSMIC_FILLING_SELECTOR).children('a').click();
    cy.get('@modalContainer').should('be.not.empty');
    cy.get('body').trigger('keydown', { key: 'Escape' });
    cy.get('@modalContainer').should('be.empty');
  });
});
