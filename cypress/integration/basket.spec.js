const ADDRESS = 'http://localhost:3000/'
const MAX_COUNT = 10


describe('Basket', ()=>{

    beforeEach(()=>{
        cy.visit(ADDRESS)
    })

    it('should hide/show all required elements on first load', ()=>{
        cy.get('[data-test=add').should('exist')
        cy.get('[data-test=checkout').should('exist')

        //Hidden redirect
        cy.get('[data-test=redirect').should('not.exist')
    })

    it('should disable checkout on initial load and enable after the first button click', ()=>{
        cy.get('[data-test=checkout').should('be.disabled')
        cy.get('[data-test=add').click()

        //Should now be enabled
        cy.get('[data-test=checkout').should('not.be.disabled')
    })

    it('should update the counter as the "Add" button is pressed up to 10, at this point the add button should be disabled and the counter should no longer update', ()=>{

        cy.get('[data-test=quantity').contains('quantity of: 0')
        cy.get('[data-test=add').should('not.be.disabled')

        //Press up to the maximum count
        for(let i=1; i<=MAX_COUNT; i++){
            cy.get('[data-test=add').click()
            cy.get('[data-test=quantity').contains(`quantity of: ${i}`)
        }

        //The button should now be disabled
        cy.get('[data-test=add').should('be.disabled')

        //Quantity should still equal maximum count
        cy.get('[data-test=quantity').contains(`quantity of: ${MAX_COUNT}`)
    })

    it('should render the Redirect component after the checkout completes', ()=>{

        //Add to basket, then checkout
        cy.get('[data-test=add').click() 
        cy.get('[data-test=checkout').click()

        //Should now exist
        cy.get('[data-test=redirect').should('exist')

        cy.get('[data-test=add').should('not.exist')
        cy.get('[data-test=checkout').should('not.exist')        
    })
})