import * as FileSystem from 'expo-file-system';
import { Asset } from 'expo-asset';

export const preloadAvatars = async () => {
    const avatars = [
        require("../../assets/Icons/menIcon/Boy1.png"),
        require("../../assets/Icons/menIcon/Boy2.png"),
        require("../../assets/Icons/menIcon/Boy3.png"),
        require("../../assets/Icons/menIcon/Boy4.png"),
        require("../../assets/Icons/menIcon/Boy5.png"),
        require("../../assets/Icons/menIcon/Boy6.png"),
        require("../../assets/Icons/menIcon/Boy7.png"),
        require("../../assets/Icons/menIcon/Boy8.png"),
        require("../../assets/Icons/menIcon/Boy9.png"),
        require("../../assets/Icons/menIcon/Boy10.png"),
        require("../../assets/Icons/menIcon/Boy11.png"),
        require("../../assets/Icons/menIcon/Boy12.png"),
        require("../../assets/Icons/menIcon/Boy13.png"),
        require("../../assets/Icons/menIcon/Boy14.png"),
        require("../../assets/Icons/menIcon/Boy15.png"),
        require("../../assets/Icons/menIcon/Boy16.png"),
        require("../../assets/Icons/menIcon/Boy17.png"),
        require("../../assets/Icons/menIcon/Boy18.png"),
        require("../../assets/Icons/menIcon/Boy19.png"),
        require("../../assets/Icons/menIcon/Boy20.png"),
        require("../../assets/Icons/girlsIcon/Girl1.png"),
        require("../../assets/Icons/girlsIcon/Girl2.png"),
        require("../../assets/Icons/girlsIcon/Girl3.png"),
        require("../../assets/Icons/girlsIcon/Girl4.png"),
        require("../../assets/Icons/girlsIcon/Girl5.png"),
        require("../../assets/Icons/girlsIcon/Girl6.png"),
        require("../../assets/Icons/girlsIcon/Girl7.png"),
        require("../../assets/Icons/girlsIcon/Girl8.png"),
        require("../../assets/Icons/girlsIcon/Girl9.png"),
        require("../../assets/Icons/girlsIcon/Girl10.png"),
        require("../../assets/Icons/girlsIcon/Girl11.png"),
        require("../../assets/Icons/girlsIcon/Girl12.png"),
        require("../../assets/Icons/girlsIcon/Girl13.png"),
        require("../../assets/Icons/girlsIcon/Girl14.png"),
        require("../../assets/Icons/girlsIcon/Girl15.png"),
        require("../../assets/Icons/girlsIcon/Girl16.png"),
        require("../../assets/Icons/girlsIcon/Girl17.png"),
        require("../../assets/Icons/girlsIcon/Girl18.png"),
        require("../../assets/Icons/girlsIcon/Girl19.png"),
        require("../../assets/Icons/girlsIcon/Girl20.png"),
    ];

    const preloadedUris = [];

    for (const avatar of avatars) {
        const asset = Asset.fromModule(avatar);
        await asset.downloadAsync(); // Ensure the asset is available

        const localUri = `${FileSystem.documentDirectory}${asset.name}`;
        preloadedUris.push(localUri);

        const fileExists = await FileSystem.getInfoAsync(localUri);
        if (!fileExists.exists) {
            // Copy asset to the document directory
            await FileSystem.copyAsync({
                from: asset.localUri || asset.uri,
                to: localUri,
            });
        }
    }

    //console.log('All avatars preloaded:', preloadedUris);
    return preloadedUris; // Return the list of local URIs
};


export const preloadAvatarMen = async () => {
    const avatars = [
        require("../../assets/Icons/menIcon/Boy1.png"),
        require("../../assets/Icons/menIcon/Boy2.png"),
        require("../../assets/Icons/menIcon/Boy3.png"),
        require("../../assets/Icons/menIcon/Boy4.png"),
        require("../../assets/Icons/menIcon/Boy5.png"),
        require("../../assets/Icons/menIcon/Boy6.png"),
        require("../../assets/Icons/menIcon/Boy7.png"),
        require("../../assets/Icons/menIcon/Boy8.png"),
        require("../../assets/Icons/menIcon/Boy9.png"),
        require("../../assets/Icons/menIcon/Boy10.png"),
        require("../../assets/Icons/menIcon/Boy11.png"),
        require("../../assets/Icons/menIcon/Boy12.png"),
        require("../../assets/Icons/menIcon/Boy13.png"),
        require("../../assets/Icons/menIcon/Boy14.png"),
        require("../../assets/Icons/menIcon/Boy15.png"),
        require("../../assets/Icons/menIcon/Boy16.png"),
        require("../../assets/Icons/menIcon/Boy17.png"),
        require("../../assets/Icons/menIcon/Boy18.png"),
        require("../../assets/Icons/menIcon/Boy19.png"),
        require("../../assets/Icons/menIcon/Boy20.png"),
    ];

    const preloadedUris = [];

    for (const avatar of avatars) {
        const asset = Asset.fromModule(avatar);
        await asset.downloadAsync(); // Ensure the asset is available

        const localUri = `${FileSystem.documentDirectory}${asset.name}`;
        preloadedUris.push(localUri);

        const fileExists = await FileSystem.getInfoAsync(localUri);
        if (!fileExists.exists) {
            // Copy asset to the document directory
            await FileSystem.copyAsync({
                from: asset.localUri || asset.uri,
                to: localUri,
            });
        }
    }

    //console.log('All avatars preloaded:', preloadedUris);
    return preloadedUris; // Return the list of local URIs

}


export const preloadAvatarWomen = async () => {
    const avatars = [
        require("../../assets/Icons/girlsIcon/Girl1.png"),
        require("../../assets/Icons/girlsIcon/Girl2.png"),
        require("../../assets/Icons/girlsIcon/Girl3.png"),
        require("../../assets/Icons/girlsIcon/Girl4.png"),
        require("../../assets/Icons/girlsIcon/Girl5.png"),
        require("../../assets/Icons/girlsIcon/Girl6.png"),
        require("../../assets/Icons/girlsIcon/Girl7.png"),
        require("../../assets/Icons/girlsIcon/Girl8.png"),
        require("../../assets/Icons/girlsIcon/Girl9.png"),
        require("../../assets/Icons/girlsIcon/Girl10.png"),
        require("../../assets/Icons/girlsIcon/Girl11.png"),
        require("../../assets/Icons/girlsIcon/Girl12.png"),
        require("../../assets/Icons/girlsIcon/Girl13.png"),
        require("../../assets/Icons/girlsIcon/Girl14.png"),
        require("../../assets/Icons/girlsIcon/Girl15.png"),
        require("../../assets/Icons/girlsIcon/Girl16.png"),
        require("../../assets/Icons/girlsIcon/Girl17.png"),
        require("../../assets/Icons/girlsIcon/Girl18.png"),
        require("../../assets/Icons/girlsIcon/Girl19.png"),
        require("../../assets/Icons/girlsIcon/Girl20.png"),
    ];

    const preloadedUris = [];

    for (const avatar of avatars) {
        const asset = Asset.fromModule(avatar);
        await asset.downloadAsync(); // Ensure the asset is available

        const localUri = `${FileSystem.documentDirectory}${asset.name}`;
        preloadedUris.push(localUri);

        const fileExists = await FileSystem.getInfoAsync(localUri);
        if (!fileExists.exists) {
            // Copy asset to the document directory
            await FileSystem.copyAsync({
                from: asset.localUri || asset.uri,
                to: localUri,
            });
        }
    }

    //console.log('All avatars preloaded:', preloadedUris);
    return preloadedUris;

}

export const preloadTaskImages = async () => {


    const avatars = [
        require("../../assets/Icons/TaskIcons/1.png"),
        require("../../assets/Icons/TaskIcons/2.png"),
        require("../../assets/Icons/TaskIcons/3.png"),
        require("../../assets/Icons/TaskIcons/4.png"),
        require("../../assets/Icons/TaskIcons/5.png"),
        require("../../assets/Icons/TaskIcons/6.png"),
        require("../../assets/Icons/TaskIcons/7.png"),
        require("../../assets/Icons/TaskIcons/8.png"),
        require("../../assets/Icons/TaskIcons/9.png"),
        require("../../assets/Icons/TaskIcons/10.png"),
        require("../../assets/Icons/TaskIcons/11.png"),
        require("../../assets/Icons/TaskIcons/12.png"),
    ];

    const preloadedUris = [];

    for (const avatar of avatars) {
        const asset = Asset.fromModule(avatar);
        await asset.downloadAsync(); // Ensure the asset is available

        const localUri = `${FileSystem.documentDirectory}${asset.name}`;
        preloadedUris.push(localUri);

        const fileExists = await FileSystem.getInfoAsync(localUri);
        if (!fileExists.exists) {
            // Copy asset to the document directory
            await FileSystem.copyAsync({
                from: asset.localUri || asset.uri,
                to: localUri,
            });
        }
    }

    //console.log('All avatars preloaded:', preloadedUris);
    return preloadedUris;

}