document.addEventListener("DOMContentLoaded",function(){
    const searchButton = document.getElementById("searchbtn");
    const usernameInput = document.getElementById("userinput");
    const statsContainer = document.querySelector(".statscont");
    const easyProgressCircle = document.querySelector(".easyprogress");
    const mediumProgressCircle = document.querySelector(".mediumprogress");
    const hardProgressCircle = document.querySelector(".hardprogress");
    const easyLabel = document.getElementById("easylabel");
    const mediumLabel = document.getElementById("mediumlabel");
    const hardLabel = document.getElementById("hardlabel");
    const cardStatsContainer = document.querySelector(".statscard");
    function validateusername(username){
        if(username.trim()===""){
            alert("username should not be empty")
            return false;
        }
        const regex = /^[a-zA-Z0-9_-]{1,15}$/;
        const isMatching = regex.test(username);
        if(!isMatching){
            alert("Invalid Username");
        }
        return isMatching;
    }
    async function  fetchuserdetails(username){
        const url=`https://leetcode-stats-api.herokuapp.com/${username}`
        try{
            searchButton.textContent="Searching....";
            searchButton.disabled=true;
            const response=await fetch(url);
            if(!response.ok){
                throw new Error("unable to fetch");
            }
            
            const pdata= await response.json();
            console.log("Status:", response.status);
            console.log("logging data: ",pdata);
            displayUserData(pdata);
        }
        catch(error){
            statsContainer.innerHTML=`<p>${error.message}</p>`
        }
        finally{
            searchButton.textContent="Search";
            searchButton.disabled=false;
        }
    }
   function updateProgress(solved, total, label, circle) {
        const progressDegree = (solved/total)*100;
        circle.style.setProperty("--progress-degree", `${progressDegree}%`);
        label.textContent = `${solved}/${total}`;
    }
    function displayUserData(pdata){
        const totalques = pdata.totalQuestions;
        const totaleasy= pdata.totalEasy;
        const totalmedium = pdata.totalMedium;
        const totalhard = pdata.totalHard;

        const totalsolved= pdata.totalSolved;
        const easysol=pdata.easySolved;
        const mediumsol=pdata.mediumSolved;
        const hardsol=pdata.hardSolved;
        updateProgress(easysol,totaleasy,easyLabel,easyProgressCircle);
        updateProgress(mediumsol,totalmedium,mediumLabel,mediumProgressCircle);
        updateProgress(hardsol,totalhard,hardLabel,hardProgressCircle);
        const carddata=[
                {label:"TotalSolved",value:totalsolved},
                {label:"TotalQuestions: ",value:totalques},
                {label:"Ranking",value:pdata.ranking},
                {label:"AcceptanceRate",value:pdata.acceptanceRate},
        ];
        console.log(carddata);
        cardStatsContainer.innerHTML=carddata.map(
            data =>
                `
                <div class="card">
                <h4>${data.label}</h>
                <p>${data.value}</p>
                </div>
                `
            
        ).join("")
        
    }
    searchButton.addEventListener('click',function(){
        const username=usernameInput.value;
        console.log(username);
        if(validateusername(username)){
            fetchuserdetails(username);
        }
    })
})