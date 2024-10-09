export default class Categories {
    constructor(name) {
        this.name = name
    }
    findCategoryByName(categories, nameCategory) {
        const foundCategory = categories.find((category) => category.name === nameCategory)
        if (typeof foundCategory === "undefined") {
            return new Error(`Category with the name ${nameCategory} not found.`);
        }
        return foundCategory
    }
    createCategory(categories, newCategory) {
        const foundCategory = this.findCategoryByName(categories, newCategory)
        if (!foundCategory.message) {
            throw new Error(`Category with the name ${newCategory} already exist.`);
        }
        const category = new Categories(newCategory)
        return category
    }
    deleteCategory(categories, nameCategory) {
        const res = this.findCategoryByName(categories, nameCategory)
        if (res.message) {
            throw Error(res.message)
        }
        categories.forEach((category, i) => {
            if (category.name === nameCategory) {
                categories.splice(i, 1)
            }
        })
        return categories
    }
    async viewCategories(categories) {
        console.table(categories)
    }
}