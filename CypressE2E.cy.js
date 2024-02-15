//ALERTS

    describe('Alerts', () => {

        //1)  Javascript Alert 
        it('Js Alert', () => {
            cy.visit('https://the-internet.herokuapp.com/javascript_alerts')
            cy.get("button[onclick='jsAlert()']").click()
            cy.on('window:alert', (t)=>{
                expect(t).to.contains('I am a JS Alert')
            cy.get('#result').should('have.text', 'You successfully clicked an alert')
            })
        })
        //2)  Javascript Confirm Alert 
        it('Confirmation Alert - OK', () => {
            cy.visit('https://the-internet.herokuapp.com/javascript_alerts')
            cy.get("button[onclick='jsConfirm()']").click()
            cy.on('window:confirm', (i)=> {
                expect(i).to.contains('I am a JS Confirm');
            })
            cy.get("#result").should('have.text', 'You clicked: Ok');
        })

        it('Confirmation Alert - Cancel', () => {
            cy.visit('https://the-internet.herokuapp.com/javascript_alerts')
            cy.get("button[onclick='jsConfirm()']").click()
            cy.on('window:confirm', ()=> false) 
            cy.get("#result").should('have.text', 'You clicked: Cancel');
        })
        //3)  Javascript Prompt Alert 
         it('JS Prompt Alert', () => {
            cy.visit('https://the-internet.herokuapp.com/javascript_alerts')
            cy.window().then((win)=> {
                cy.stub(win, 'prompt').returns('welcome')
            })
            cy.get("button[onclick='jsPrompt()']").click()
            cy.get("#result").should('have.text', 'You entered: welcome');
        })
        //4)  Autheniticated Alert 
        it('Authenticated Alert', () => {
            // podejscie pierwsze - poprzez URL i przekazanie parametrów poprzez JSON format
            cy.visit('https://the-internet.herokuapp.com/basic_auth',{auth: {username: "admin", password: "admin"}});
            //I teraz po wpisaniu mozemy walidować, np. czy zostałem zalogowany. - tutaj sprawdzamy tylko kawalek tekstu ktory zostal pokazany po poprawnym zalogowaniu.
            cy.get("div[class='example'] p").should('have.contain', "Congratulations")
            //podejscie drugie - dodać do URL.
            cy.visit('https://admin:admin@the-internet.herokuapp.com/basic_auth')
            cy.get("div[class='example'] p").should('have.contain', "Congratulations")
        })
    })

    //ASSERTIONS

    describe("Assertions demo", () => {

    it("Implicit assertions", ()=> {

        cy.visit("https://opensource-demo.orangehrmlive.com/web/index.php/auth/login")

        cy.url().should('include', 'orangehrmlive.com')

        cy.url().should('eq','https://opensource-demo.orangehrmlive.com/web/index.php/auth/login')

        cy.url().should('contain','orangehrm')

        cy.url().should('include', 'orangehrmlive.com')
        .should('eq', 'https://opensource-demo.orangehrmlive.com/web/index.php/auth/login')
        .should('contain', 'orangehrm')

        cy.url().should('include', 'orangehrmlive.com')
        .and('eq', 'https://opensource-demo.orangehrmlive.com/web/index.php/auth/login')
        .and('contain', 'orangehrm')

        cy.url().should('include', 'orangehrmlive.com')
        .and('eq', 'https://opensource-demo.orangehrmlive.com/web/index.php/auth/login')
        .and('contain', 'orangehrm')
        .and('not.contain', 'gfreenhmrm')

        cy.title().should('include','Orange')
        .and('eq','OrangeHRM')
        .and('contain','HRM')

        cy.get('.orangehrm-login-branding > img').should('be.visible').and('exist')

        cy.xpath("//a").should('have.length','5') 

        cy.get("input[placeholder='Username']").type("Admin") 

        cy.get("input[placeholder='Username']").should("have.value", "Admin") 
    })


    it("explicit assertions", () => {

        cy.visit("https://opensource-demo.orangehrmlive.com/web/index.php/auth/login")

        cy.get("input[placeholder='Username']").type("Admin")

        cy.get("input[placeholder='Password']").type("admin123")
        
        cy.get("button[type='submit']").click()

        let expName = "Nabeel Shanaz"; 

        cy.get(".oxd-userdropdown-name").then( (x)=>{

            let actName=x.text()

            expect(actName).to.equal(expName)
            expect(actName).to.not.equal(expName)


            assert.equal(actName, expName)
            assert.not.equal(actName, expName)


        })

    })


    
    //TABS

    describe('Handle tab', (()=>{

        //podejscie pierwsze
    it.skip('Approach1',()=>{

        cy.visit('https://the-internet.herokuapp.com/windows')

        cy.get(".example >a").invoke('removeAttr','target').click();

        cy.url().should('include','https://the-internet.herokuapp.com/windows/new')

        cy.go('back');

    })
        //podejscei drugie 
    it('Approach2', ()=>{

        cy.visit('https://the-internet.herokuapp.com/windows');

        cy.get(".example >a").then((e)=>{
            let url=e.prop('href');
            cy.visit(url);
            cy.url().should('include','https://the-internet.herokuapp.com/windows/new')
            cy.go('back');
            
        })
    })

}))

//TABLE

describe('Handle Tables', (()=>{

    beforeEach('Login', ()=>{
        cy.visit("https://demo.opencart.com/admin/index.php");

        cy.get("#input-username").type("demo");

        cy.get("#input-password").type("demo");

        cy.get("button[type='submit']").click()

        cy.get(".btn-close").click()

        cy.get("#menu-customer>a").click()

        cy.get("#menu-customer>ul>li:first-child").click()
    })


    it('Check Number Rows & Columns', ()=>{

        cy.get("table[class='table table-bordered table-hover']>tbody>tr").should('have.length', '10');
    
        cy.get("table[class='table table-bordered table-hover']>thead>tr>td").shadow('have.length','7');



    })

    it('Check cell data from specific row & Column',()=>{

        cy.get("table[class='table table-bordered table-hover']>tbody>tr:nth-child(5)>td:nth-child(3)")
        .contains("hfgjhgjgjggj@gmail.com");

    })


    it('Read all the rows & Columns data in the first page', ()=>{
        
        cy.get("table[class='table table-bordered table-hover']>tbody>tr")
            .each(($row, index, $rows)=>{

            cy.wrap($row).within( ()=>{
            
                cy.get("td").each(($column, index, $columns)=>{
                
                    cy.log($col.text());

                })
            })
            })  
        
    })


    it('Pagination', ()=>{
  
      let totalPages;
        cy.get(".col-sm-6.text-end").then( (e) =>{
            let mytext=e.text(); //Showing 1 to 10 of 1854 (321 Pages) - takie cos przechwyciliśmy 
            //musimy przechwycić te ostatnie 321 pages - zrobimy to metodą zwiazana z modyfikacja stringu
            //
           totalPages = mytext.substring(mytext.indexOf("(")+1, mytext.indexOf("Pages")-1)
           cy.log("Total number of pages in a table=====>"+totalPages);
        })

       

        //chce pobrac tylko dane z 5 stron
        let totalPages=5;
     
        for (let p=1; p<=5; p++){
    
            if(totalPages>1){
                cy.log("Active Page is:"+p)
          
                cy.get("ul[class='pagination']>li:nth-child("+p+")").click();

                py.wait(3000);
        
                cy.get("table[class='table table-bordered table-hover']>tbody>tr")
                .each(($row, index, $rows)=>{

                    cy.wrap($row).within( ()=>{
                
                        cy.get('td:nth-child(3)').then((e)=>{
                           cy.log(e.text()); //email 
                        })

                    })

                })

            }

        }

    })

}))

//Radio Buttons and Checkboxes

describe("Check UI Elements", ()=>{

    it("Checking Radio Buttons", () => {
        //pisze kod ktory odpali stronę którą testujemy
        cy.visit("https://testautomationpractice.blogspot.com/")
        //pobieram input male oraz female poprzez CSS selektor i sprawdzam go czy jest widoczny.
        cy.get("input#male").should('be.visible')
        cy.get("input#female").should('be.visible')
        //Zaznaczamy male button poprzez .check() a potem sprawdzamy czy zostal zaznaczony
        cy.get("input#male").check().should('be.checked')
        //sprawdzam i potwierdzam testem ze female button nie jest zaznaczony (nie uzywam check bo go nie zaznaczam!!)
        cy.get("input#female").should('be.not.checked')
        // to samo co wyzej tylko na odwrot, po prostu podczas testu zostalo odznaczone i zaznaczone female (jako ze moze byc jedno)
        cy.get("input#female").check().should('be.checked')
        cy.get("input#male").should('be.not.checked')
    })

        it("Checking  Checkboxes", () => {

        cy.visit("https://testautomationpractice.blogspot.com/")

        cy.get("input#sunday").should('be.visible')
    
        cy.get("input#monday").check().should('be.checked')

        cy.get("input#monday").uncheck().should('not.be.checked')

        cy.get("input.form-check-input[type='checkbox']").check().should('be.checked')

        cy.get("input.form-check-input[type='checkbox']").uncheck().should('be.not.checked')

        cy.get("input.form-check-input[type='checkbox']").first().check().should('be.checked')

        cy.get("input.form-check-input[type='checkbox']").last().check()

    })

})

// MOUSE EVENTS

import 'cypress-iframe'
require ('@4tw/cypress-drag-drop')

describe("Mouse Operations", ()=>{

    it('MouseHover', ()=>{

        cy.visit('https://demo.opencart.com/');

        cy.get('body > main:nth-child(3) > div:nth-child(1) > nav:nth-child(1) > div:nth-child(3) > ul:nth-child(1) > li:nth-child(1) > div:nth-child(2) > div:nth-child(1) > ul:nth-child(1) > li:nth-child(2) > a:nth-child(1)').should('not.be.visible');

        cy.get('.nav > :nth-child(1) > .dropdown-toggle').trigger('mouseover').click(); 
        
        cy.get('body > main:nth-child(3) > div:nth-child(1) > nav:nth-child(1) > div:nth-child(3) > ul:nth-child(1) > li:nth-child(1) > div:nth-child(2) > div:nth-child(1) > ul:nth-child(1) > li:nth-child(2) > a:nth-child(1)').should('be.visible');
    
    });

     it('Right Click', ()=>{

        cy.visit('http://swisnl.github.io/jQuery-contextMenu/demo.html');

        cy.get('.context-menu-one.btn.btn-neutral').trigger('contextmenu');

        cy.get('.context-menu-item.context-menu-icon.context-menu-icon-cut').should('be.visible');

        cy.get('.context-menu-one.btn.btn-neutral').rightclick();

        cy.get('.context-menu-item.context-menu-icon.context-menu-icon-cut').should('be.visible');


    });

     it('Double Click', ()=>{
        
        cy.visit('https://www.w3schools.com/tags/tryit.asp?filename=tryhtml5_ev_ondblclick3');
     
        cy.frameLoaded('#iframeResult'); 

        //podejscie pierwsze z dblclick
        cy.iframe('#iframeResult').find("button[ondblclick='myFunction()']").dblclick(); 

        cy.iframe('#iframeResult').find('#field2').should('have.value', 'Hello World!'); 

        //podejscie drugie z trigger
        cy.iframe('#iframeResult').find("button[ondblclick='myFunction()']").trigger('dblclick');


    });

     it('Drag and drop using plugin', ()=>{

        cy.visit('https://www.dhtmlgoodies.com/scripts/drag-drop-custom/demo-drag-drop-3.html/');

        cy.get('#box6').should('be.visible');

        cy.get('#box106').should('be.visible');

        cy.wait('3000');
        
        cy.get('#box6').drag('#box106', {force:true}); 
    });

     it.only('Scrolling page', ()=>{

        cy.visit('https://www.countries-ofthe-world.com/flags-of-the-world.html');

        cy.get(':nth-child(2) > tbody > :nth-child(43) > :nth-child(1) > img').scrollIntoView({duration:2000});

        cy.get(':nth-child(2) > tbody > :nth-child(43) > :nth-child(1) > img').should('be.visible');

        cy.get(':nth-child(1) > tbody > :nth-child(4) > :nth-child(1) > img').scrollIntoView({duration:2000});

        cy.get(':nth-child(1) > tbody > :nth-child(4) > :nth-child(1) > img').should('be.visible');

    });
})


//DROPDOWNS

describe("Handle dropdowns", ()=>{

    it.skip("dropdown with select", ()=>{
        
        cy.visit("https://www.zoho.com/commerce/free-demo.html")

        cy.get("#zcf_adress_country")
        .select("Italy")
        .should('have.value', 'Italy')
    })

      it.skip("dropdown withouth select", ()=>{
        
        cy.visit("https://www.dummyticket.com/dummy-ticket-for-visa-application/")
 
        cy.get("#select2-billing_country-container").click()

        cy.get('.select2-search__field').type('Italy').type('{enter}')

        cy.get("#select2-billing_country-container").should('have.text','Italy')

    })

     it.skip("Autosuggestion dropdown", ()=>{
        
        cy.visit('https://wikipedia.org/')

        cy.get('#searchInput').type('Delhi')

        cy.get('.suggestion-title').contains('Delhi Heights').click()

    })

     it("Dynamic dropdown", ()=>{
        
        cy.visit('https://google.com/')

        cy.get("input[name='q']").type('Cypress automation')

        cy.wait(3000)

        cy.get('div.wM6W7d>span').each($el, index, $list)=>{
            if($el.text()==='Cypress automation tool')
            {
                cy.wrap($el).click()
            }
        }

    })

})

// FRAMES

import 'cypress-iframe'

describe('Handling Frames',()=>{

    it('Approach1', ()=>{

      cy.visit('https://the-internet.herokuapp.com/iframe');

     let iframe=cy.get('#mce_0_ifr')
        .its('0.contentDocument.body') 
        .should('be.visible') 
        .then(cy.wrap); 


        iframe.clear().type('welcome {ctrl+a}'); 

        cy.get('button[title="Bold"]').click();

    })

    it('Approach2 - uzywajac stworzonej koemndy', ()=>{

    cy.visit('https://the-internet.herokuapp.com/iframe');

    cy.getIframe('#mce_0_ifr').clear().type("welcome {ctrl+a}");

     cy.get('button[title="Bold"]').click();
     

    })

    it.only('Approach3 - cypress iframe plugin', ()=>{

        cy.visit('https://the-internet.herokuapp.com/iframe');

        cy.frameLoaded('#mce_0_ifr');

        cy.iframe('#mce_0_ifr').clear().type("welcome {ctrl+a}");

         cy.get('button[title="Bold"]').click();
    

    })

})


// FILE UPLOADS

import 'cypress-file-upload';

describe('File Uploads', ()=>{

    it('Single File Upload', ()=>{

        cy.visit('https://the-internet.herokuapp.com/upload');

        cy.get('#file-upload').attachFile('QAEN.pdf');
        cy.get('.button').click()
        cy.wait(3000);

        cy.get("div[class='example'] h3").should('have.text', 'File Uploaded!');

        

    })

    it('File Upload - Rename', ()=>{

         cy.visit('https://the-internet.herokuapp.com/upload');

        cy.get('#file-upload').attachFile({filePath:'QAEN.pdf', fileName:'NEWQAEN.pdf'});
        cy.get('.button').click()
        cy.wait(3000);

        cy.get("div[class='example'] h3").should('have.text', 'File Uploaded!');

    })

    it('File Upload - Drag and drop', ()=>{

        cy.visit('https://the-internet.herokuapp.com/upload');

        cy.get("#drag-drop-upload").attachFile("QAEN.pdf", {subjectType:'drag-n-drop'})
        cy.wait(5000);
        cy.get("div[class='dz-preview dz-file-preview dz-processing dz-success dz-complete'] div[class='dz-details'] span").contains('QAEN.pdf');


    })

    it('Multiple files Upload', ()=>{
        cy.visit('https://davidwalsh.name/demo/multiple-file-upload.php');
        cy.get('#filesToUpload').attachFile(['QAEN.pdf', 'QAPL.pdf']);
        cy.wait(3000);
        cy.get(':nth-child(6) > strong').should('have.text', 'Files You Selected:');


    })

    it.only('File upload - Shadow Dom', ()=>{

        cy.visit("https://htmlelements.com/demos/fileupload/shadow-dom/index.htm");

        cy.get(".smart-browse-input", {includeShadowDom:true}).attachFile('QAEN.pdf');
        cy.wait(5000)

        cy.get(".smart-file", {includeShadowDom:true}).contains('QAEN.pdf');
    })

})