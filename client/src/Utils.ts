export default class Utils {
    public static capitalizeFirstLetter = (s: string) => {
        return s.charAt(0).toUpperCase() + s.slice(1);
    };
    public static sortUnique = (arr: []) => {
        if (arr.length === 0) {
            return arr;
        }
        arr = arr.sort((a, b) => a*1 - b*1 );
        // @ts-ignore
        const ret = [ arr[0] ];
        for (let i = 1; i < arr.length; i++) {
            if (arr[i-1] !== arr[i]) {
                ret.push(arr[i]);
            }
        }
        return ret;
    };
}