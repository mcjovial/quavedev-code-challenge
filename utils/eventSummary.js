export function peopleInTheEvent(people) {
  return people.filter(person => person.checkIn && !person.checkOut).length;
}

export function peopleNotCheckedIn(people) {
  return people.filter(person => !person.checkIn).length;
}

export function peopleByCompanyInTheEvent(people) {
  const peopleIn = people.filter(person => person.checkIn && !person.checkOut);

  let companies = [];

  peopleIn.forEach(person => {
    const { companyName } = person;

    if (!companyName) {
      return;
    }

    const companyNameAlreadyInList = companies.findIndex(name => name.includes(companyName));

    if (companyNameAlreadyInList !== -1) {
      const companiesCopy = [...companies];

      const [, companyNumberWithParentheses] = companiesCopy[companyNameAlreadyInList].split(/(?<=\D)(?=\d)/);
      const companyNumber = Number(companyNumberWithParentheses.replace('(', '').replace(')', ''));

      companiesCopy[companyNameAlreadyInList] = `${companyName} (${companyNumber + 1})`;
      companies = [...companiesCopy];
      return;
    }

    companies.push(`${companyName} (1)`);
  });

  return companies.length > 0 ? companies : ['none'];
}
