import { useNavigate } from "react-router";

import MemeList, { MemeDetails } from "../editor/MemeList";
import { EditorWrapper } from "../theme/Theme";

const featuredMemes: MemeDetails[] = import.meta.env.PROD
  ? [
      {
        id: "0x0146f5-0x02",
        url: `${
          import.meta.env.VITE_IPFS_GATEWAY_URL
        }bafybeif2pudnqm2p5klwap6k5nekgohupxss4j3buasrdxgoozozmod5ea/image.png`,
      },
      {
        id: "0x0146f5-0x03",
        url: `${
          import.meta.env.VITE_IPFS_GATEWAY_URL
        }bafybeid2hexpglz3swzqaan5jjaxhuaghblk6bgkooc6bbojo3p5dxajgu/image.png`,
      },
      {
        id: "0x0146f5-0x04",
        url: `${
          import.meta.env.VITE_IPFS_GATEWAY_URL
        }bafybeicmdtani4camf4oopzfcj53j4h2isz6q5nwpyhsecln7kyekjcqaa/image.png`,
      },
      {
        id: "0x0146f5-0x05",
        url: `${
          import.meta.env.VITE_IPFS_GATEWAY_URL
        }bafybeidrd4vpi75kf72bo2ke7dfvwbk3infksc6gv64d2paevz2zd74fzi/image.png`,
      },
      {
        id: "0x0146f5-0x06",
        url: `${
          import.meta.env.VITE_IPFS_GATEWAY_URL
        }bafybeigimw4zhavn5vqvksqrolzoo3gzmljcdkxy3qdbgaohqc7g3thv54/image.png`,
      },
      {
        id: "0x0146f5-0x07",
        url: `${
          import.meta.env.VITE_IPFS_GATEWAY_URL
        }bafybeicbwhu7izdxmxkri4uejeelumcivpbbmvghf7hqybcwtntw7q4vsa/image.png`,
      },
      {
        id: "0x0146f5-0x08",
        url: `${
          import.meta.env.VITE_IPFS_GATEWAY_URL
        }bafybeigqrx67txpmg5qgypck62xggw4xipyer2m2ygkbnjw72zvx7mrxma/image.png`,
      },
      {
        id: "0x0146f5-0x09",
        url: `${
          import.meta.env.VITE_IPFS_GATEWAY_URL
        }bafybeicr45sxoxainaoykz7qk7bhtectidupvkx5rczuljg2ah6tep6jb4/image.png`,
      },
      {
        id: "0x0146f5-0x0a",
        url: `${
          import.meta.env.VITE_IPFS_GATEWAY_URL
        }bafybeick66rmhw72khlmd6swhbyh72ccyye7t53amzc5hwwq3ujiks42bm/image.png`,
      },
      {
        id: "0x0146f5-0x0b",
        url: `${
          import.meta.env.VITE_IPFS_GATEWAY_URL
        }bafybeiag3mmpiv4jrqtgn6vsvihrx4hczbidl7ocl32k36hqld6yp4xhfm/image.png`,
      },
      {
        id: "0x0146f5-0x0c",
        url: `${
          import.meta.env.VITE_IPFS_GATEWAY_URL
        }bafybeidulw46ku773nz2jwuidpsmxccirizyrzbn3kkkgyu35dccovkxue/image.png`,
      },
      {
        id: "0x0146f5-0x0d",
        url: `${
          import.meta.env.VITE_IPFS_GATEWAY_URL
        }bafybeigjjfrrjjt4y5uz3q3ct7zsxazny2oduuckcxtsfugmuc5ukdxtqe/image.png`,
      },
      {
        id: "0x0146f5-0x0e",
        url: `${
          import.meta.env.VITE_IPFS_GATEWAY_URL
        }bafybeicgbfuon4su7rqu4ogazoxfdrtbbwmlqemhfgmhndqr3vbdo6uc6u/image.png`,
      },
      {
        id: "0x0146f5-0x0f",
        url: `${
          import.meta.env.VITE_IPFS_GATEWAY_URL
        }bafybeicg2cmumtmkojlujbnxgmpo6sk3aofjhw5gd2dqogvnbd3gtefj6m/image.png`,
      },
      {
        id: "0x0146f5-0x10",
        url: `${
          import.meta.env.VITE_IPFS_GATEWAY_URL
        }bafybeiaii72reqwdra4j4zfktdo6or3dmffsnwvbmglmbwnm4c3wb24unu/image.png`,
      },
      {
        id: "0x0146f5-0x11",
        url: `${
          import.meta.env.VITE_IPFS_GATEWAY_URL
        }bafybeigpctrdisp4ola33ivtuikruy26mr6blnxbrpjt24vrtkfhuq4zza/image.png`,
      },
      {
        id: "0x0146f5-0x12",
        url: `${
          import.meta.env.VITE_IPFS_GATEWAY_URL
        }bafybeiaar3yhkt46knag677ctxmzzze7zwm7vmw5juz5bj74m3d3p3q7aa/image.png`,
      },
      {
        id: "0x0146f5-0x13",
        url: `${
          import.meta.env.VITE_IPFS_GATEWAY_URL
        }bafybeicm4ph636gi4cg7ch5a3pv6hm7hoiksfqwptlly2rzcjy7po7c7pi/image.png`,
      },
      {
        id: "0x0146f5-0x14",
        url: `${
          import.meta.env.VITE_IPFS_GATEWAY_URL
        }bafybeiglhr3ut63z6drndwprqztpix2gs64fym4hhn6cu4kqigtndqk2tm/image.png`,
      },
      {
        id: "0x0146f5-0x15",
        url: `${
          import.meta.env.VITE_IPFS_GATEWAY_URL
        }bafybeigkg2jkcookrjttc4gvzj27sncwdtfcx2rb2safsyic3vfqhvfgdm/image.png`,
      },
      {
        id: "0x0146f5-0x16",
        url: `${
          import.meta.env.VITE_IPFS_GATEWAY_URL
        }bafybeicalu3jdytf6utqiod6vzztr6rwjfckkrei4i3palyhtep6so7kna/image.png`,
      },
      {
        id: "0x0146f5-0x17",
        url: `${
          import.meta.env.VITE_IPFS_GATEWAY_URL
        }bafybeierbarqqdedmmtssejkilyqyyqancs7lo54mgqdyrz6cldmoxn3bm/image.png`,
      },
      {
        id: "0x0146f5-0x18",
        url: `${
          import.meta.env.VITE_IPFS_GATEWAY_URL
        }bafybeibeye5fjkk3fztgzvtpq5loxiau2nrmqyaeqhxea7e46geu6gwg5a/image.png`,
      },
      {
        id: "0x0146f5-0x19",
        url: `${
          import.meta.env.VITE_IPFS_GATEWAY_URL
        }bafybeiedxjyjjyq555t42ij6ehgkelloceuwgzgwvdcuhlt2k7e2rpblfe/image.png`,
      },
      {
        id: "0x0146f5-0x1a",
        url: `${
          import.meta.env.VITE_IPFS_GATEWAY_URL
        }bafybeiddfkaqritad5yjxbtiwfmugyj3356lpmyryl6edkb3gadcfkixxq/image.png`,
      },
      {
        id: "0x0146f5-0x1b",
        url: `${
          import.meta.env.VITE_IPFS_GATEWAY_URL
        }bafybeifkqoadwkg7sz5l3azkqbtu7raynuyqyupkiodbc3hh2xopf5imum/image.png`,
      },
      {
        id: "0x0146f5-0x1c",
        url: `${
          import.meta.env.VITE_IPFS_GATEWAY_URL
        }bafybeibms4e3ebonfotjlwkiolpt47cuhu3ivx57quq56rsbxhwxulx664/image.png`,
      },
      {
        id: "0x0146f5-0x1d",
        url: `${
          import.meta.env.VITE_IPFS_GATEWAY_URL
        }bafybeiaa2ijg6pnaqn6dncioxvuu6opp4v3xmj2tlnvpzsinkqyw6ep6fy/image.png`,
      },
      {
        id: "0x0146f5-0x1e",
        url: `${
          import.meta.env.VITE_IPFS_GATEWAY_URL
        }bafybeifrmmncesmt7s5wqt5xia4pcizvxkuucmhfkuyn3wic4fq7l2fs5y/image.png`,
      },
      {
        id: "0x0146f5-0x1f",
        url: `${
          import.meta.env.VITE_IPFS_GATEWAY_URL
        }bafybeibw6ldrgdb7s5e4vnri63yk3hsuwp3h5p2thtlgemxlb5sx5cy4r4/image.png`,
      },
      {
        id: "0x0146f5-0x20",
        url: `${
          import.meta.env.VITE_IPFS_GATEWAY_URL
        }bafybeibk2cinn2tdvp5upja2uvgnmxkm544qxww2577sqcde6u3qrwskmq/image.png`,
      },
      {
        id: "0x0146f5-0x21",
        url: `${
          import.meta.env.VITE_IPFS_GATEWAY_URL
        }bafybeihsrhlaqvnogyadjshepzy4rzlstaqsvj3xo5gendabygct5cymfu/image.png`,
      },
      {
        id: "0x0146f5-0x23",
        url: `${
          import.meta.env.VITE_IPFS_GATEWAY_URL
        }bafybeicf3sjf3z5nzm4o2x4sgc6vqmwqmqqr3xdqcfxp2d763iou4bycwy/image.png`,
      },
      {
        id: "0x0146f5-0x24",
        url: `${
          import.meta.env.VITE_IPFS_GATEWAY_URL
        }bafybeiba5d7ji47d6d63doayfzxxp4xajmjw5jjx26wop2rj5y3ywyptdq/image.png`,
      },
      {
        id: "0x0146f5-0x25",
        url: `${
          import.meta.env.VITE_IPFS_GATEWAY_URL
        }bafybeic574t77tuh5pv76w3yoooatrjvebeou576pvgus2llfwv6bpdp4m/image.png`,
      },
      {
        id: "0x0146f5-0x26",
        url: `${
          import.meta.env.VITE_IPFS_GATEWAY_URL
        }bafybeiaxgusnpj4f75eu4vgdbwfzy37tmoga2436gq2p5hslk6detac3uu/image.png`,
      },
      {
        id: "0x0146f5-0x27",
        url: `${
          import.meta.env.VITE_IPFS_GATEWAY_URL
        }bafybeigz67275z27ny4s4q4yjxbwvxafvhzumq7r7nzbsp2wbw5nvunpdq/image.png`,
      },
      {
        id: "0x0146f5-0x28",
        url: `${
          import.meta.env.VITE_IPFS_GATEWAY_URL
        }bafybeig3tmrov4fve7vg6o6xvyhxvkgntiqlsfn72jqyurhz2f6suyysza/image.png`,
      },
      {
        id: "0x0146f5-0x29",
        url: `${
          import.meta.env.VITE_IPFS_GATEWAY_URL
        }bafybeifbemvockjnp7nwixocaavjwgmwc5b2poqd75kn2xdgayizc2t7yi/image.png`,
      },
      {
        id: "0x0146f5-0x2a",
        url: `${
          import.meta.env.VITE_IPFS_GATEWAY_URL
        }bafybeihfmssvfropxmz6x3oyrld57xpcdsgznz5e3owgtcysxnthagq2pi/image.png`,
      },
      {
        id: "0x0146f5-0x2b",
        url: `${
          import.meta.env.VITE_IPFS_GATEWAY_URL
        }bafybeih3stuzzkc3xm7o74qkbnbdbencezyd6du63gkbsfj3mhszzhc6ym/image.png`,
      },
      {
        id: "0x0146f5-0x2c",
        url: `${
          import.meta.env.VITE_IPFS_GATEWAY_URL
        }bafybeifazunk2usrpehkfxy4noqu72jnkmjypkqn7ptqvnzj7ajxtudcv4/image.png`,
      },
      {
        id: "0x0146f5-0x2d",
        url: `${
          import.meta.env.VITE_IPFS_GATEWAY_URL
        }bafybeif324pz2yv6eyxptl5wi6nal4er2sfdbn7ztgi7gfr6lvufkmfo34/image.png`,
      },
      {
        id: "0x0146f5-0x2e",
        url: `${
          import.meta.env.VITE_IPFS_GATEWAY_URL
        }bafybeieidhns7rd6zfkubgdvp54rsfxqhaf7ural47gyng3cvwgn5tiuba/image.png`,
      },
      {
        id: "0x0146f5-0x2f",
        url: `${
          import.meta.env.VITE_IPFS_GATEWAY_URL
        }bafybeia3ruokzew33vpf3wnwk4ywaja5wbd5z4c6wddnmciwaal2fyf2ge/image.png`,
      },
      {
        id: "0x0146f5-0x30",
        url: `${
          import.meta.env.VITE_IPFS_GATEWAY_URL
        }bafybeidiaoragadrdxk75ptfn6nhgtf6qh5xzixfxbd2fzf5g65apc4bpe/image.png`,
      },
      {
        id: "0x0146f5-0x41", // TODO: needs new title
        url: `${
          import.meta.env.VITE_IPFS_GATEWAY_URL
        }bafybeifzzjx3bddovuijxln52rgdelxgb3a22bwmginbtdu3525olsejva/image.png`,
      },
      {
        id: "0x0146f5-0x32",
        url: `${
          import.meta.env.VITE_IPFS_GATEWAY_URL
        }bafybeicuvyzfly4cjelizqovtgeemidcrylc2k4u3xmwpribim3kgephqm/image.png`,
      },
      {
        id: "0x0146f5-0x33",
        url: `${
          import.meta.env.VITE_IPFS_GATEWAY_URL
        }bafybeifjgqxu26tk2bpof7it7xku7vpeegyqgv6zhtyoi3iwudwptcndiq/image.png`,
      },
      {
        id: "0x0146f5-0x34",
        url: `${
          import.meta.env.VITE_IPFS_GATEWAY_URL
        }bafybeibzpdihbaxxocfan23ewnrcbgcjpmn422eirkh5jca7v5c334lode/image.png`,
      },
      {
        id: "0x0146f5-0x35",
        url: `${
          import.meta.env.VITE_IPFS_GATEWAY_URL
        }bafybeiaylqn7r3xan7uwapvmqivgintspeekwxwindpo7mn7xswvrprola/image.png`,
      },
      {
        id: "0x0146f5-0x36",
        url: `${
          import.meta.env.VITE_IPFS_GATEWAY_URL
        }bafybeiehyi53dmovxicjku6srpxowrom4yz3kgnri2faxemy2nonam54xa/image.png`,
      },
      {
        id: "0x0146f5-0x37",
        url: `${
          import.meta.env.VITE_IPFS_GATEWAY_URL
        }bafybeifpoox26zcftidwuw3euc6hrppiqokpbpx7umoc6ftuvfbkfj5e2q/image.png`,
      },
      {
        id: "0x0146f5-0x38",
        url: `${
          import.meta.env.VITE_IPFS_GATEWAY_URL
        }bafybeihizk4cjlwk3fvmwdxtnesbv2oz4qkkpsappfuwya7zhwiq5ypi7i/image.png`,
      },
      {
        id: "0x0146f5-0x39",
        url: `${
          import.meta.env.VITE_IPFS_GATEWAY_URL
        }bafybeiaidxx7zognl4iksco2u6mrc75s65qz6nr5iz72yeui7jqvfnenfi/image.png`,
      },
      {
        id: "0x0146f5-0x3a",
        url: `${
          import.meta.env.VITE_IPFS_GATEWAY_URL
        }bafybeig5qhyk5f6wutemypz3talpb4rqdnu2t4fonbfltcwmtjrn6i3tji/image.png`,
      },
      {
        id: "0x0146f5-0x3b",
        url: `${
          import.meta.env.VITE_IPFS_GATEWAY_URL
        }bafybeia3x2tsekrqfwpi422yqlljgh7dc4wzog55sv732srzhaugxiziju/image.png`,
      },
      {
        id: "0x0146f5-0x3c",
        url: `${
          import.meta.env.VITE_IPFS_GATEWAY_URL
        }bafybeids2choa7xxde3dcpu3k6476jbwrtkea7tj5zx7k7xpwsme37ogi4/image.png`,
      },
      {
        id: "0x0146f5-0x3d",
        url: `${
          import.meta.env.VITE_IPFS_GATEWAY_URL
        }bafybeigt7itccrodgthrm7mqej3mkktufe2er7ucr6mgnbudp54ouvzdrm/image.png`,
      },
      {
        id: "0x0146f5-0x3e",
        url: `${
          import.meta.env.VITE_IPFS_GATEWAY_URL
        }bafybeiba7w4h24etcsxja7dtjszq6cw2e5iy3tt7gjysj2y4zkcfu2cw5y/image.png`,
      },
      {
        id: "0x0146f5-0x3f",
        url: `${
          import.meta.env.VITE_IPFS_GATEWAY_URL
        }bafybeicuxkfmfg35mnkkmqpdnyjer3bl7eoaa27fy3kidzt3eg3wc2rive/image.png`,
      },
      {
        id: "0x0146f5-0x43",
        url: `${
          import.meta.env.VITE_IPFS_GATEWAY_URL
        }bafybeidbla3oufdahq3474o4hwqbvd7edgbregeik45hbcfbvvdpavalne/image.png`,
      },
      {
        id: "0x0146f5-0x44",
        url: `${
          import.meta.env.VITE_IPFS_GATEWAY_URL
        }bafybeicphxl5czbntkzuimifffljoh7ghdvjwkoehle55og3yl5q27rwpu/image.png`,
      },
      {
        id: "0x0146f5-0x45",
        url: `${
          import.meta.env.VITE_IPFS_GATEWAY_URL
        }bafybeihcjhqf65xtd4mfu2pjq5o3oamx6rw6qtzfpz45gn5japzmbbho6m/image.png`,
      },
      {
        id: "0x0146f5-0x46",
        url: `${
          import.meta.env.VITE_IPFS_GATEWAY_URL
        }bafybeie7caeoighqsiihpsh3nko6avooupexsgyneg36a6daqagynbjnve/image.png`,
      },
      {
        id: "0x0146f5-0x49",
        url: `${
          import.meta.env.VITE_IPFS_GATEWAY_URL
        }bafybeiefggx7t6sgk2nh6fc54t5tonycqwvccgn7vkrjqm25krqkzclw3m/image.png`,
      },
      {
        id: "0x0146f5-0x4a",
        url: `${
          import.meta.env.VITE_IPFS_GATEWAY_URL
        }bafybeifx6nbibytjbmkr5rcdceo7zy5ej33aomykixafz6tmi73ppvnqma/image.png`,
      },
      {
        id: "0x0146f5-0x4d",
        url: `${
          import.meta.env.VITE_IPFS_GATEWAY_URL
        }bafybeidk3cvftoof5thiwlz2uw7ejbayq7erdps5rl74hueknikglfscri/image.png`,
      },
      {
        id: "0x0146f5-0x4b",
        url: `${
          import.meta.env.VITE_IPFS_GATEWAY_URL
        }bafybeidkseo36b7wkvbdstatu66dz6zvdp3ydjry5bluuf2jlbdy5gsniq/image.png`,
      },
      {
        id: "0x0146f5-0x4c",
        url: `${
          import.meta.env.VITE_IPFS_GATEWAY_URL
        }bafybeicd4wky7h5umljyga3u3rdcdl27famhqimjou3z43itahrccrcdle/image.png`,
      },
      {
        id: "0x0146f5-0x5c",
        url: `${
          import.meta.env.VITE_IPFS_GATEWAY_URL
        }bafybeidmkhlbamfsv47ridzokm3hqn6fjrevytdr3ma36lv54gokycaq7a/image.png`,
      },
      {
        id: "0x0146f5-0x5b",
        url: `${
          import.meta.env.VITE_IPFS_GATEWAY_URL
        }bafybeickkoe2es3i3wnl3tirbxz7xvbh2dqdsyv57naaz5sodgzjq77qge/image.png`,
      },
      {
        id: "0x0146f5-0x5a",
        url: `${
          import.meta.env.VITE_IPFS_GATEWAY_URL
        }bafybeifxks7lzmt4nscrj3iufxlla3edh43awkhy773b62wvtxi6czgdp4/image.png`,
      },
      {
        id: "0x0146f5-0x59",
        url: `${
          import.meta.env.VITE_IPFS_GATEWAY_URL
        }bafybeibxu4jutk6gq52cnbmnfgwog7frlj4ieel4iluuisepsgsxdocqbi/image.png`,
      },
      {
        id: "0x0146f5-0x58",
        url: `${
          import.meta.env.VITE_IPFS_GATEWAY_URL
        }bafybeibdf6juezgtkb2mrxsgnzlnoschy6p5mz7p6i7nsaxfo46qgdkrcq/image.png`,
      },
      {
        id: "0x0146f5-0x57",
        url: `${
          import.meta.env.VITE_IPFS_GATEWAY_URL
        }bafybeiglp2xllvc2stezli6yhqt4wsx6f4xhjtq4u2iyl3b65opiesnhzm/image.png`,
      },
      {
        id: "0x0146f5-0x56",
        url: `${
          import.meta.env.VITE_IPFS_GATEWAY_URL
        }bafybeih2gqwxbis5zyhhia3rainy4rddsltk564cgjzabsetdxvht65dfi/image.png`,
      },
      {
        id: "0x0146f5-0x55",
        url: `${
          import.meta.env.VITE_IPFS_GATEWAY_URL
        }bafybeig2rqq6hqoe5mw76fmawrtzzozwdiotp2equnddbek5ymzrkqkqje/image.png`,
      },
      {
        id: "0x0146f5-0x54",
        url: `${
          import.meta.env.VITE_IPFS_GATEWAY_URL
        }bafybeiegt4p2vbg5iid6g3a524axxtsh22ap7dhusbofktt373z2nbuh5y/image.png`,
      },
      {
        id: "0x0146f5-0x53",
        url: `${
          import.meta.env.VITE_IPFS_GATEWAY_URL
        }bafybeiggure4de3nosyfyn2uaaf6ocqbbbnxvezjfz4miyxzhakzvkgd4u/image.png`,
      },
      {
        id: "0x0146f5-0x52",
        url: `${
          import.meta.env.VITE_IPFS_GATEWAY_URL
        }bafybeigjawvibsivs7xzpuapane36w7pn6w3gdnuhk5dh3mmot6kcgvwma/image.png`,
      },
      {
        url: `${
          import.meta.env.VITE_IPFS_GATEWAY_URL
        }bafybeifoobj3ldqmgt7tpbq2ux4cuwkq3pe2lcp4wjo7wtgmqqid7bxlam/image.png`,
        id: "0x0146f5-0x65",
      },
      {
        url: `${
          import.meta.env.VITE_IPFS_GATEWAY_URL
        }bafybeianeocg2mbpgfllbwkg3otfoobj7x5gwf4r3oli7g4ywu6xicsp3m/image.png`,
        id: "0x0146f5-0x67",
      },
      {
        url: `${
          import.meta.env.VITE_IPFS_GATEWAY_URL
        }bafybeidocc3mgqyoysdwji4lpjjmadbuwd5ukzhjlykxzbwgndh5mma23e/image.png`,
        id: "0x0146f5-0x73",
      },
      {
        url: `${
          import.meta.env.VITE_IPFS_GATEWAY_URL
        }bafybeieinr6awhfmw6moffaa7m3z6ndpllok3xc2e6qfzu7ukspqi3zaii/image.png`,
        id: "0x0146f5-0x66",
      },
      {
        url: `${
          import.meta.env.VITE_IPFS_GATEWAY_URL
        }bafybeic3hn6aod7umfwl2dbfz6x7im5qvld5mqxgc4locr3ykkmccsswz4/image.png`,
        id: "0x0146f5-0x63",
      },
      {
        url: `${
          import.meta.env.VITE_IPFS_GATEWAY_URL
        }bafybeiehiz4lyyvxwbpdxuanqoq34rigtoja2z4rlv5vcnhcwfh57ch5lu/image.png`,
        id: "0x0146f5-0x6a",
      },
      {
        url: `${
          import.meta.env.VITE_IPFS_GATEWAY_URL
        }bafybeie7gsexcd4g2awcpfgtutsepscujd4ycbkphqvzula2h2ptn6wvhy/image.png`,
        id: "0x0146f5-0x68",
      },
      {
        url: `${
          import.meta.env.VITE_IPFS_GATEWAY_URL
        }bafybeieyqpzwuyamasithex34p2mqklifnwmqk2ke45vd575jn7aurjcby/image.png`,
        id: "0x0146f5-0x70",
      },
      {
        url: `${
          import.meta.env.VITE_IPFS_GATEWAY_URL
        }bafybeihkg6l72j6vdopq6prjbotnp6g5u5i6bjilznhbhgd7brjsc7z5xe/image.png`,
        id: "0x0146f5-0x72",
      },
      {
        url: `${
          import.meta.env.VITE_IPFS_GATEWAY_URL
        }bafybeih3tv3a4qvd6tbn5fnku3ewryqkq3dgg73e5uw2fps2bwqpimkoue/image.png`,
        id: "0x0146f5-0x69",
      },
      {
        url: `${
          import.meta.env.VITE_IPFS_GATEWAY_URL
        }bafybeiati63it5qcqrhxx2dra7u6aik3pc2jiiajpjom2n5bd46h3vyb2e/image.png`,
        id: "0x0146f5-0x6b",
      },
      {
        url: `${
          import.meta.env.VITE_IPFS_GATEWAY_URL
        }bafybeihzigdtk47hfa3f5r6jkeivj3l4ueckrypjpy7d5viuze4pg2vlzy/image.png`,
        id: "0x0146f5-0x6e",
      },
      {
        url: `${
          import.meta.env.VITE_IPFS_GATEWAY_URL
        }bafybeihbrlsjthieqvahzhlzn7yff35pjfuloixioikjidnmyasmxuraze/image.png`,
        id: "0x0146f5-0x6c",
      },
      {
        url: `${
          import.meta.env.VITE_IPFS_GATEWAY_URL
        }bafybeihlytggss2iayxylavtftuugsbsomzdvirusndwqd64xezszfviyi/image.png`,
        id: "0x0146f5-0x6d",
      },
      {
        url: `${
          import.meta.env.VITE_IPFS_GATEWAY_URL
        }bafybeig5ispocipii5ekjlricb54rryni7gzw7fk3j7hyetvx2phto3ixe/image.png`,
        id: "0x0146f5-0x6f",
      },
      {
        url: `${
          import.meta.env.VITE_IPFS_GATEWAY_URL
        }bafybeiavnvxbgzm2tgbtmkd3ozrlo2e3i37leg76mawf5oguy7cg6q7vxu/image.png`,
        id: "0x0146f5-0x64",
      },
      {
        url: `${
          import.meta.env.VITE_IPFS_GATEWAY_URL
        }bafybeia7csejo6cacuc5qyvhv4vgqyawje7wkj32pradphcytmeqh3g73y/image.png`,
        id: "0x0146f5-0x74",
      },
      {
        url: `${
          import.meta.env.VITE_IPFS_GATEWAY_URL
        }bafybeiavum5xawaviwxdcyqjtu77kq6hylbsyy3msna2lpre757szxro6e/image.png`,
        id: "0x0146f5-0x71",
      },
      {
        url: `${
          import.meta.env.VITE_IPFS_GATEWAY_URL
        }bafybeic4gmtvi5qqkr4gbq5lvbcpsdhae6dqdywt3myi45ix35w3xghjru/image.png`,
        id: "0x0146f5-0x61",
      },
      {
        url: `${
          import.meta.env.VITE_IPFS_GATEWAY_URL
        }bafybeibw3upqizgh2wl5ogw4cpfryirspxu4qwng2fimomqho5ecqjnmea/image.png`,
        id: "0x0146f5-0x60",
      },
      {
        url: `${
          import.meta.env.VITE_IPFS_GATEWAY_URL
        }bafybeidrgmtzthjcko27ql4p43wuise46naycmh6yktfx6healjxjabnym/image.png`,
        id: "0x0146f5-0x62",
      },
      {
        url: `${
          import.meta.env.VITE_IPFS_GATEWAY_URL
        }bafybeienqzet36pftonhf3j3eyhorwy6o3fsq3r2mjdwf4yu4hashwabce/image.png`,
        id: "0x0146f5-0x5e",
      },
      {
        url: `${
          import.meta.env.VITE_IPFS_GATEWAY_URL
        }bafybeidd7movgysckvn6g333nre76jodiddnzkejkfs7zfcxqzk5ameh2a/image.png`,
        id: "0x0146f5-0x5f",
      },
      {
        url: `${
          import.meta.env.VITE_IPFS_GATEWAY_URL
        }bafybeic3liajudwhkbs3ha7tjbsvumqibwbji2sdbfwzowubcoipx3cnbq/image.png`,
        id: "0x0146f5-0x5d",
      },
      {
        url: `${
          import.meta.env.VITE_IPFS_GATEWAY_URL
        }bafybeibj5o6ytyxugythh5lpmxo7piplx7rhibg2zdxi6txpwhsqgtbp5y/image.png`,
        id: "0x019db4-0x10",
      },
      {
        url: `${
          import.meta.env.VITE_IPFS_GATEWAY_URL
        }bafybeicj7itk64zpdkuppak2vp2u7spbsupxr6ajfutg64rpwcjey5jaju/image.png`,
        id: "0x019db4-0x12",
      },
      {
        url: `${
          import.meta.env.VITE_IPFS_GATEWAY_URL
        }bafybeidcivxdpzhauutisxyyoychlokhqpqgg7xh3wubrdfej6hnljf55y/image.png`,
        id: "0x019db4-0x13",
      },
      {
        url: `${
          import.meta.env.VITE_IPFS_GATEWAY_URL
        }bafybeifjyz6ue4gtbj4qv5s6l4fwxetsxwyh4z6jgzbopw7diyrylaigpm/image.png`,
        id: "0x019db4-0x14",
      },
      {
        url: `${
          import.meta.env.VITE_IPFS_GATEWAY_URL
        }bafybeihu32rpyi2xeadiea55hjywg3cr43tpbns2ditlwivvtxiw56rlyi/image.png`,
        id: "0x019db4-0x15",
      },
      {
        url: `${
          import.meta.env.VITE_IPFS_GATEWAY_URL
        }bafybeiaojtmrh5en5pqzsyrpxej734ikx2facl3omvy2zccvaqqnusp6di/image.png`,
        id: "0x019db4-0x16",
      },
      {
        url: `${
          import.meta.env.VITE_IPFS_GATEWAY_URL
        }bafybeiftlzjsog6mtnxywhkg27e7geefckhfeklrii5nhxlgd7zbsdsy3a/image.png`,
        id: "0x019db4-0x18",
      },
      {
        url: `${
          import.meta.env.VITE_IPFS_GATEWAY_URL
        }bafybeif6rkcxl3ylfufmbznbp5lftkvowcv22fcsvb23kzagrn7xgtsxpu/image.png`,
        id: "0x019db4-0x1a",
      },
      {
        url: `${
          import.meta.env.VITE_IPFS_GATEWAY_URL
        }bafybeiepl743mqf5zzqcb6dh2hc2yhmt7egqjde3hm6g2w3prplw6whi4u/image.png`,
        id: "0x019db4-0x1b",
      },
      {
        url: `${
          import.meta.env.VITE_IPFS_GATEWAY_URL
        }bafybeiecczrh4a6leve7n3nkqaqo3tcnoaskwqgfw35oiugpcquyhop6zq/image.png`,
        id: "0x019db4-0x1c",
      },
      {
        url: `${
          import.meta.env.VITE_IPFS_GATEWAY_URL
        }bafybeib4tczosx5blgr7hr4lmykrbmolodrq6733yipy5r2h3m53c3kili/image.png`,
        id: "0x019db4-0x1d",
      },
      {
        url: `${
          import.meta.env.VITE_IPFS_GATEWAY_URL
        }bafybeigzfqpz455dn64jfjeiduwkvkhgv7uo4mhg4qv6sxfg5hyyg4uiyq/image.png`,
        id: "0x019db4-0x1e",
      },
      {
        url: `${
          import.meta.env.VITE_IPFS_GATEWAY_URL
        }bafybeic57igkgnwqozxgsqc62dcg3k6dvjnqaiz5t2c5oouf3qmqe74etu/image.png`,
        id: "0x019db4-0x1f",
      },
      {
        url: `${
          import.meta.env.VITE_IPFS_GATEWAY_URL
        }bafybeidlssarc2oucxc36inot5v66mlhvugtc4uc22tji32ahxlp7ieypi/image.png`,
        id: "0x019db4-0x20",
      },
      {
        url: `${
          import.meta.env.VITE_IPFS_GATEWAY_URL
        }bafybeibfsywpi32iatztvdktpb6ylpr3qjndwg3of4y4j37sf3wqmdxdzq/image.png`,
        id: "0x019db4-0x21",
      },
      {
        url: `${
          import.meta.env.VITE_IPFS_GATEWAY_URL
        }bafybeig3kqhibxxz73k2i3vrbdenocwr5vsq3f276bjdv5lghqgneqs2ke/image.png`,
        id: "0x019db4-0x22",
      },
      {
        url: `${
          import.meta.env.VITE_IPFS_GATEWAY_URL
        }bafybeib22pkzf3i2e7bvs3cvvpkeebnretujx5o7kbpqnokukzgo56scna/image.png`,
        id: "0x019db4-0x23",
      },
      {
        url: `${
          import.meta.env.VITE_IPFS_GATEWAY_URL
        }bafybeifqmdmgwhgquxw5bjbbkxvpfkcgzdkat7w4igkc26rtusv4woggzy/image.png`,
        id: "0x019db4-0x0b",
      },
      {
        url: `${
          import.meta.env.VITE_IPFS_GATEWAY_URL
        }bafybeidvgu47psvji5nmcsgztgzpzuxe2gz2zgwzvxhgfcqhvalnp6cdnm/image.png`,
        id: "0x019db4-0x0a",
      },
      {
        url: `${
          import.meta.env.VITE_IPFS_GATEWAY_URL
        }bafybeih4njuavlmqhf4cuf3hvs26gzaksaaqhpks3sauilhx6vndyntrjy/image.png`,
        id: "0x019db4-0x09",
      },
      {
        url: `${
          import.meta.env.VITE_IPFS_GATEWAY_URL
        }bafybeihlblquscvsa2fzz5iw7l6pjgfpytqvjd7r4ya267snkrhimj435i/image.png`,
        id: "0x019db4-0x08",
      },
      {
        url: `${
          import.meta.env.VITE_IPFS_GATEWAY_URL
        }bafybeibbbfwnzde2e2mfp3f6ikfyhz46r5nw5fvcklz4q34wc7h52of654/image.png`,
        id: "0x019db4-0x06",
      },
      {
        url: `${
          import.meta.env.VITE_IPFS_GATEWAY_URL
        }bafybeicr3yqhmsx76ocy3reize3vsmuhe7xnd6zowi2oxx55ywywvvfoh4/image.png`,
        id: "0x019db4-0x05",
      },
      {
        url: `${
          import.meta.env.VITE_IPFS_GATEWAY_URL
        }bafybeiea7grroe7gnms72rxq33gnrnkcrlkfoccfgnoqwbiprkg5dkicam/image.png`,
        id: "0x019db4-0x04",
      },
      {
        url: `${
          import.meta.env.VITE_IPFS_GATEWAY_URL
        }bafybeihse6hukx2hd7ubya2eoojaolwfursmqdd575f5hkklv6dtmyvaqq/image.png`,
        id: "0x019db4-0x03",
      },
      {
        url: `${
          import.meta.env.VITE_IPFS_GATEWAY_URL
        }bafybeig7nh3rtmptpdyoz3qamra3c4ncazkdrptahrc2tt3ssdprpyntje/image.png`,
        id: "0x0146f5-0x78",
      },
      {
        url: `${
          import.meta.env.VITE_IPFS_GATEWAY_URL
        }bafybeibkexerdpbiwa4zcbqo7zpajrcjck22qmhnwpy5rktdwzf7bxuw6y/image.png`,
        id: "0x0146f5-0x7e",
      },
      {
        url: `${
          import.meta.env.VITE_IPFS_GATEWAY_URL
        }bafybeiek6jrm2yotjh26wzhi7fkr55p7kqu2eop55izuazfv5ssghyvt5a/image.png`,
        id: "0x0146f5-0x7f",
      },
      {
        url: `${
          import.meta.env.VITE_IPFS_GATEWAY_URL
        }bafybeidg6ecxtccxqliezpvktp4j4o7qbn5bz5tzbdc42aj3qytwo4panq/image.png`,
        id: "0x0146f5-0x80",
      },
      {
        url: `${
          import.meta.env.VITE_IPFS_GATEWAY_URL
        }bafybeig6jsa6h7ogxo36devc2clj4dgwp774eivj6had34qtodpqw5pl6a/image.png`,
        id: "0x0146f5-0x81",
      },
      {
        url: `${
          import.meta.env.VITE_IPFS_GATEWAY_URL
        }bafybeibl7o7txtg75jap6izdh7y2t6eoaxvcsp7g7nan6grqfeve6c2ztq/image.png`,
        id: "0x0146f5-0x82",
      },
      {
        url: `${
          import.meta.env.VITE_IPFS_GATEWAY_URL
        }bafybeiabevzo6v2lacpblvbl7eiucijl5zu5vcab5l2xiam2f3kkxk7qv4/image.png`,
        id: "0x0146f5-0x83",
      },
      {
        url: `${
          import.meta.env.VITE_IPFS_GATEWAY_URL
        }bafybeif7vep6kxgmm2njaf6al6lahqeyudhhf5byagteh2en4y3ccgckva/image.png`,
        id: "0x0146f5-0x84",
      },
      {
        url: `${
          import.meta.env.VITE_IPFS_GATEWAY_URL
        }bafybeihz2kvcrxe3hbhsidklry3pajpktxuv7xjdmj7e2n4olp5carjzuq/image.png`,
        id: "0x01b318-0x06",
      },
      {
        url: `${
          import.meta.env.VITE_IPFS_GATEWAY_URL
        }bafybeifcfpud53t66xxz55mwm5z3faha2wqrglijvs6crnwq4hrpz74x5e/image.png`,
        id: "0x01b318-0x07",
      },
      {
        url: `${
          import.meta.env.VITE_IPFS_GATEWAY_URL
        }bafybeidyvnrmtlqbpjlvbf7qij3umq3y4mrzq4ifuzwnliahhlgwaxz624/image.png`,
        id: "0x01b318-0x08",
      },
      {
        url: `${
          import.meta.env.VITE_IPFS_GATEWAY_URL
        }bafybeihyyv6u3o7mhcpdnpydb4d3ha72b7qgozn5yacugm5xyho574k43i/image.png`,
        id: "0x01b318-0x09",
      },
      {
        url: `${
          import.meta.env.VITE_IPFS_GATEWAY_URL
        }bafybeidsrxt2yrsw5bb7mqqu5ohtlrqhlexgrajvjfctrcxfm7fkdsdobi/image.png`,
        id: "0x01b318-0x0c",
      },
      {
        url: `${
          import.meta.env.VITE_IPFS_GATEWAY_URL
        }bafybeicjqokybgm75wurzn5pxyjitz34m677sbkoj4dzs7mhgiifqx3c4m/image.png`,
        id: "0x01b318-0x0d",
      },
      {
        url: `${
          import.meta.env.VITE_IPFS_GATEWAY_URL
        }bafybeidx7axofby4ssquqcedgwvekompz5jp2yr64m7a6kd3ldn4xwloj4/image.png`,
        id: "0x01b318-0x10",
      },
      {
        url: `${
          import.meta.env.VITE_IPFS_GATEWAY_URL
        }bafybeifmdsyslbzhphimlpwyyzvhvppqqssmqlgmvarvm65lmrwnihmsrq/image.png`,
        id: "0x01b318-0x13",
      },
      {
        url: `${
          import.meta.env.VITE_IPFS_GATEWAY_URL
        }bafybeifduewlz3qv2fgyyyf4bnmczgiw6jjnyijxmr4oofcyn7whc353za/image.png`,
        id: "0x0146f5-0x79",
      },
      {
        url: `${
          import.meta.env.VITE_IPFS_GATEWAY_URL
        }bafybeihmwjmpzfqlygbxzpanqyzifvk7rbfivovnrsv4izh3ftgu6cvepi/image.png`,
        id: "0x0146f5-0x7a",
      },
      {
        url: `${
          import.meta.env.VITE_IPFS_GATEWAY_URL
        }bafybeic4bxx57dkpbrk7bzccrfpask3cyrcm5saiflaycu2vjvpphzrblm/image.png`,
        id: "0x0146f5-0x7b",
      },
      {
        url: `${
          import.meta.env.VITE_IPFS_GATEWAY_URL
        }bafybeidn4fbxzz4qd2aeyncnjnpfyomc267xskhiibpwgffylqulqcgopu/image.png`,
        id: "0x0146f5-0x7c",
      },
      {
        url: `${
          import.meta.env.VITE_IPFS_GATEWAY_URL
        }bafybeihuguxa52jjsga3uz33pwnc6j2mmgzxyvwkdzbld2vard6k6qasim/image.png`,
        id: "0x0146f5-0x7d",
      },
      {
        url: `${
          import.meta.env.VITE_IPFS_GATEWAY_URL
        }bafybeieivanxh3hyxodzlq7jtqlbimm7fougbukgkfczvqdyk7ttpgz3ly/image.jpg`,
        id: "0x01b318-0x16",
      },
      {
        url: `${
          import.meta.env.VITE_IPFS_GATEWAY_URL
        }bafybeic2bvtbqa72i4ouxjcuexkomuswu5oghqqishwbcpa7aotb6o52jq/image.jpg`,
        id: "0x01b318-0x18",
      },
      {
        url: `${
          import.meta.env.VITE_IPFS_GATEWAY_URL
        }bafybeif3gtyqggdblepk3ipcnvinm6eaud74opv2rhuvju3vs263h7wbxi/image.jpg`,
        id: "0x01b318-0x1a",
      },
      {
        url: `${
          import.meta.env.VITE_IPFS_GATEWAY_URL
        }bafybeih2bep4tlh2sqjvpg3mf64msslfbwhgm7vkpukma5s4j6s4qde6wi/image.jpg`,
        id: "0x01b318-0x1b",
      },
      {
        url: `${
          import.meta.env.VITE_IPFS_GATEWAY_URL
        }bafybeigtghset43evr2ymzhovk4u36xajyzcc67kc736z7bkg37frpfh4a/image.jpg`,
        id: "0x01b318-0x1d",
      },
      {
        url: `${
          import.meta.env.VITE_IPFS_GATEWAY_URL
        }bafybeiclvcsosvdapyose3gue2ggssy7qrmsnpxz57a3c6cnbdjptw7oam/image.jpg`,
        id: "0x01b318-0x1c",
      },
      {
        url: `${
          import.meta.env.VITE_IPFS_GATEWAY_URL
        }bafybeigqglylpcdkvobxv4u7r4t7vvokdu7uwz5uhcccllqfifh634747y/image.jpg`,
        id: "0x01b318-0x1e",
      },
      {
        url: `${
          import.meta.env.VITE_IPFS_GATEWAY_URL
        }bafybeidezo2amlhrs6dur5c4qs67ua5xxd6qhdnm6ca2w57bca6ymzf77y/image.jpg`,
        id: "0x0146f5-0x85",
      },
    ]
  : [
      {
        id: "0x47a4-0x20",
        url: `${import.meta.env.VITE_IPFS_GATEWAY_URL}QmbHueApxQEofa6EurBxt9zfuJS5vznRq8QUzseM1H47TK/image.png`,
      },
      {
        id: "0x47a4-0x1e",
        url: `${import.meta.env.VITE_IPFS_GATEWAY_URL}QmUmr9yCpSfMNfQmR9aWE4aA7dDuUr9v2w1YrTDTFHDY6s/image.png`,
      },
      {
        id: "0x47a4-0x1d",
        url: `${import.meta.env.VITE_IPFS_GATEWAY_URL}Qme1JA3wSSRmMF69s8P9YzbJ2BzvWVgjVT4idc3PX3HMUQ/image.png`,
      },
      {
        id: "0x47a4-0x1c",
        url: `${import.meta.env.VITE_IPFS_GATEWAY_URL}QmcpbNW6UmPiByUCaVkSb79wTU6UwfCNzXU2DarRRoFjUC/image.png`,
      },
      {
        id: "0x47a4-0x1b",
        url: `${import.meta.env.VITE_IPFS_GATEWAY_URL}Qma29MNG6Yf9kAmjARQMKSvLkSfYPjr6Z93tM1tm4zA2kL/image.png`,
      },
    ];

export interface FeaturedMemeTemplatesProps {
  competitionId?: string;
}

function FeaturedMemeTemplates({ competitionId }: FeaturedMemeTemplatesProps): JSX.Element {
  const navigate = useNavigate();

  return (
    <EditorWrapper>
      <MemeList
        onSelected={(meme) => {
          window.scrollTo(0, 0);
          if (competitionId) {
            navigate(`/meme/create/${competitionId}/editor/${meme.id}`);
          } else {
            navigate(`/meme/create/editor/${meme.id}`);
          }
        }}
        memes={featuredMemes}
        selectMode={true}
      />
    </EditorWrapper>
  );
}

export default FeaturedMemeTemplates;
