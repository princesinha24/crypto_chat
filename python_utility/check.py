import sys
from hashlib import sha256
import hashlib
import random
import json

############################ Global Value ############################
prime_no=9999999967
add_no=549755813888
alpha=56711
data={}
############################ END ############################

def hash_string_256(pwd):
    hash_pwd = hashlib.sha256(pwd.encode('utf-8'))
    return hash_pwd.hexdigest()

############################ Password Encryption function ############################ 
def encrypte_img(img,pwd):
    j=0
    hexadecimal = pwd
    end_length = len(hexadecimal) * 4
    
    hex_as_int = int(hexadecimal, 16)
    hex_as_binary = bin(hex_as_int)
    b_pwd = hex_as_binary[2:].zfill(end_length)
    for i in range (img.shape[0]):
        if(b_pwd[j]=='1' and (img[i][0][j%3])%2==0):
            img[i][0][j%3]=img[i][0][j%3]^1
        elif(b_pwd[j]=='0' and (img[i][0][j%3])%2==1):
            img[i][0][j%3]=img[i][0][j%3]^1
        j+=1
        if(b_pwd[j]=='1' and (img[i][127][j%3])%2==0):
            img[i][127][j%3]=img[i][127][j%3]^1
        elif(b_pwd[j]=='0' and (img[i][127][j%3])%2==1):
            img[i][127][j%3]=img[i][127][j%3]^1
        j+=1
    return img
############################ END ############################

############################ Generate key ############################
def generate_key(key1, key2, prime_no):
    p_key=1
    q=int(key1)
    m=int(key2)
    while(m):
        if(m%2==1):
            p_key=(p_key*q)%prime_no
        m=m//2
        q=(q*key1)%prime_no   
    c=str(p_key)
    return c
############################ END ############################

############################ getKey ############################

def getKey(private_key, public_key):
    private_key = int(private_key)-add_no
    public_key = int(public_key)
    key = generate_key(public_key, private_key, prime_no)
    key = hash_string_256(key)
    key = hex_bin(key)
    key=list(key)
    return key

############################ END ############################

############################ Public key ############################ 
def public_key():
    while(1):
        key1 = (random.random())*prime_no
        key1=round(key1)
        if key1>7 or key1<=prime_no-8:
            break
    pub_key=generate_key(alpha,key1,prime_no)
    data['public_key'] = pub_key
    data['private_key'] = str(key1 + add_no)
############################ END ############################ 

############################ binary to string for encrypted mssg############################ 
def bin_str_enc(res):
    mp = {0:'0',
           1:'1',
           2:'2',
           3:'3',
           4:'4',
           5:'5',
           6:'6',
           7:'7',
           8:'8',
           9:'9',
           10:'a',
           11:'b',
           12:'c',
           13:'d',
           14:'e',
           15:'f' }
    ans=list()
    i=0
    while(i<len(res)):
        p=0
        q=8
        j=0
        while(j<4):
            if(res[i]=='1'):
                p+=q
            q=q//2
            i+=1
            j+=1
        ans.append(mp[p])
    return ans
############################ END ############################ 

############################ binary to string for decrypted mssg ############################ 
def bin_str_dec(res):
    ans=list()
    i=0
    while(i<len(res)):
        p=0
        q=128
        j=0
        while(j<8):
            if(res[i]=='1'):
                p+=q
            q=q//2
            i+=1
            j+=1
        if p==0:
            break
        else:
            ans.append(chr(p))
    return ans
############################ END ############################

############################ Msseage Encryption ############################
def encryption_mssg(key,word):
    lt=[]
    rt=[]
    for i in range (256):
        lt.append(word[i])
        rt.append(word[i+256])
    j=0
    while(j<16):
        if j%2==0:
            for i in range (len(rt)):
                if (lt[i]=='0' and key[i]=='1') or (lt[i]=='1' and key[i]=='0'):
                    if(rt[i]=='0'):
                        rt[i]='1'
                    else:
                        rt[i]='0'
        else:
            for i in range (len(lt)):
                if (rt[i]=='0' and key[i]=='1') or (rt[i]=='1' and key[i]=='0'):
                    if(lt[i]=='0'):
                        lt[i]='1'
                    else:
                        lt[i]='0'
        for i in range (16):
            k=(i-16+256)%256
            p=key[i]
            while(1):
                key[k],p=p,key[k]
                k=(k-16+256)%256
                if(k==i):
                    break
            key[i]=p
        j+=1
    for i in range (len(rt)):
        lt.append(rt[i])
    return lt
############################ END ############################ 

############################ Msseage Decryption ############################
def decryption_mssg(key,word):
    lt=[]
    rt=[]
    for i in range (256):
        lt.append(word[i])
        rt.append(word[i+256])
    j=0
    
    while(j<16):
        for i in range (16):
            k=i+16
            p=key[i]
            while(1):
                key[k],p=p,key[k]
                k=(k+16)%256
                if(k==i):
                    break
            key[i]=p
        if j%2==1:
            for i in range (len(rt)):
                if (lt[i]=='0' and key[i]=='1') or (lt[i]=='1' and key[i]=='0'):
                    if(rt[i]=='0'):
                        rt[i]='1'
                    else:
                        rt[i]='0'
        else:
            for i in range (len(lt)):
                if (rt[i]=='0' and key[i]=='1') or (rt[i]=='1' and key[i]=='0'):
                    if(lt[i]=='0'):
                        lt[i]='1'
                    else:
                        lt[i]='0'
        
        j+=1
    for i in range (len(rt)):
        lt.append(rt[i])
    return lt
############################ END ############################

############################ hexa to binary ############################ 
def hex_bin(d):
    mp = {'0' : "0000", 
              '1' : "0001",
              '2' : "0010", 
              '3' : "0011",
              '4' : "0100",
              '5' : "0101", 
              '6' : "0110",
              '7' : "0111", 
              '8' : "1000",
              '9' : "1001", 
              'a' : "1010",
              'b' : "1011", 
              'c' : "1100",
              'd' : "1101", 
              'e' : "1110",
              'f' : "1111" }
    b=''
    for i in range (len(d)):
        b+=mp[d[i]]
    return b
############################ END ############################


############################ make data of required sie ############################
def make_data_size(res, length_of_word):
    mod_diff=length_of_word-(len(res)%length_of_word)
    #add '0' to make data of required size
    for i in range (mod_diff):
        res+='0'
    return res    

############################ send message ############################
def send_message(word, private_key, public_key):
    data['message']=word
    key = getKey(private_key, public_key)
    res = ''.join(format(ord(i), '08b') for i in word)
    mssg=make_data_size(res, 512)
    encrypt_mssg=""
    for i in range (len(mssg)//512):
        content=mssg[i*512:(i+1)*512]
        ans=encryption_mssg(key,content)
        ans=bin_str_enc(ans)
        #concatenate ans to encrypt_mssg
        for j in range (len(ans)):
                encrypt_mssg+=ans[j]

    data['encrypt_mssg']=encrypt_mssg
############################ END ########################################


############################ receive message ############################

def receive_message(word, private_key, public_key):
    key = getKey(private_key, public_key)
    mssg=hex_bin(word)
    decrypt_mssg=""
    for i in range (len(mssg)//512):
        content=mssg[i*512:(i+1)*512]
        ans=decryption_mssg(key, content)
        ans=bin_str_dec(ans)
        for j in range (len(ans)):
            decrypt_mssg+=ans[j]
    data['decrypt_mssg']=decrypt_mssg        
############################ END ########################################

if __name__ == "__main__":
    data['msg']="Hello from check.py"
    arguments = sys.argv[1:]
    if(arguments[0]=="check"):
        check()
    elif(arguments[0]=="hash_string_256"):
        pwd=arguments[1]    
        hash_string_256(pwd)
    elif(arguments[0]=="public_key"):
        public_key()
    elif(arguments[0]=="send_message"):
        send_message(arguments[1], arguments[2], arguments[3]) 
    elif(arguments[0]=="receive_message"):
        receive_message(arguments[1], arguments[2], arguments[3])
    print(json.dumps(data))
