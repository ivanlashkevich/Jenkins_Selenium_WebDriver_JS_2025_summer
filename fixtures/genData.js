import { faker } from '@faker-js/faker';

export default {
    newProject: function () {
        let Project = {
            name: faker.company.buzzNoun(),
            longName: faker.commerce.productName(),
            newName: faker.company.buzzNoun(),
            description: faker.lorem.sentences(3),
            newDescription: faker.lorem.sentences(2),
            folderName: faker.company.buzzNoun(),
            newFolderName: faker.company.buzzNoun(),
            longDescription: faker.lorem.sentences(50),
            userName: faker.person.lastName(),
            tokenName: faker.person.lastName(),
            email: faker.internet.email()
        };
        return Project;
    },
};