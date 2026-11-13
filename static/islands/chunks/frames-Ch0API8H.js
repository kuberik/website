const l=(t,e)=>[...t.querySelectorAll("section h2")].find(c=>e.test(c.textContent?.trim()??""))?.closest("section")??null;export{l as c};
