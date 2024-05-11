import puppeteer from 'puppeteer';
import * as xlsx from 'xlsx';

// Job Title
// Company Name
// Location
// Job Type (Full-time, Part-time, Contract, etc.)
// Posted Date
// Job Description

// shall save the data into excel file
function storeDataIntoExcelFile(jobs){
    if(jobs.length===0){
      return ;
    }      
      // now i want to save it into the excel file
      // Create a new workbook
      try {
        let sheet = xlsx.utils.json_to_sheet(jobs);
        let workbook = xlsx.utils.book_new();
          xlsx.utils.book_append_sheet(workbook, sheet, 'sheet1');
    
          xlsx.writeFile(workbook, 'jobs.xlsx');
          console.log('Data saved into jobs.xlsx file Successfully!');
        
      } catch (error) {
        console.log('ERROR saving data into excel file. ', error);
      }
}

// help me providing some time to load web page, and then begin scraping
  let customWait = (delay)=> new Promise((resolve, reject)=>{
    setTimeout(()=>{resolve()}, delay);
  });


// the Engine
async function init(){
  let URL = 'https://www.naukri.com/it-jobs?src=gnbjobs_homepage_srch';
  const browser = await puppeteer.launch({headless: false});
  try {
    // launch a browser and open a new blank tab
      const page = await browser.newPage();

    // set the screen size
        await page.setViewport({width: 1920, height: 1080});
    
    // open a url inside that new tab
      await page.goto(URL);
      await customWait(3000);
    // fetching 
    let jobs = await page.$$eval('div.srp-jobtuple-wrapper', e=>e.map((element)=>{
        let jobTitle, companyName, jobLocation, jobType, postedDate, jobDescription;
        jobTitle = element.querySelector('div.row1>a.title');
        jobTitle = jobTitle ? jobTitle.textContent : '';
        
        companyName = element.querySelector('span.comp-dtls-wrap>a.comp-name.mw-25');
        companyName = companyName ? companyName.textContent : '';

        if (companyName === ''){
          // let find it somewhere else
            companyName = element.querySelector('div.row2>span.comp-dtls-wrap>a.comp-name');
            companyName = companyName ? companyName.textContent : '';
        }

        jobLocation = element.querySelector('div.job-details span.ni-job-tuple-icon.ni-job-tuple-icon-srp-location.loc>span.locWdth');
        jobLocation = jobLocation ? jobLocation.textContent: '';
    
        postedDate = element.querySelector('div.row6>span.job-post-day');
        postedDate = postedDate ? postedDate.textContent : '';

        jobDescription = element.querySelector('div.row4>span.job-desc.ni-job-tuple-icon.ni-job-tuple-icon-srp-description');
        jobDescription = jobDescription  ? jobDescription.textContent : '';
          let job = {
            'Posted Date': postedDate,
            'Company Name': companyName,
            'Location': jobLocation,
            'Job Title': jobTitle,
            // 'Job Type (Full-time, Part-time, Contract, etc.)': jobType,
            'Job Description': jobDescription
          };

        return job;

        
      }));

      console.log(jobs);
      storeDataIntoExcelFile(jobs);
    

    
    
  } catch (error) {
    console.log('There is an error, ', error);
  }finally{
    // closing the browser
      setTimeout(async ()=>{

        await browser.close();
      },5000)
  }


}

init();
